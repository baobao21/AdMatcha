import os
import uuid
import aiohttp
import smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage
from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from twilio.rest import Client
import spacy

import subprocess
subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
nlp = spacy.load("en_core_web_sm")

app = FastAPI()

origins = ["https://baobao21.github.io"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory databases
ads_db = []
users_db = {}

IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")
TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = os.getenv("TWILIO_FROM")
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

twilio_client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)


def extract_keywords_nouns(text):
    doc = nlp(text.lower())
    return set(token.text for token in doc if token.pos_ == "NOUN" and len(token.text) > 2)


@app.post("/submit_ad/")
async def submit_ad(
    email: str = Form(...),
    text: str = Form(...),
    location: str = Form(None),
    whatsapp: str = Form(...),
    file: UploadFile = File(None)
):
    if email not in users_db:
        users_db[email] = {"email": email, "ads": [], "whatsapp": whatsapp}

    img_url = None
    if file:
        content = await file.read()
        async with aiohttp.ClientSession() as session:
            form = aiohttp.FormData()
            form.add_field("image", content, filename=file.filename)
            async with session.post(f"https://api.imgbb.com/1/upload?key={IMGBB_API_KEY}", data=form) as resp:
                result = await resp.json()
                img_url = result["data"]["url"]

    keywords = list(extract_keywords_nouns(text))
    now = datetime.utcnow()
    ad_id = str(uuid.uuid4())

    ad = {
        "id": ad_id,
        "email": email,
        "text": text,
        "location": location,
        "keywords": keywords,
        "whatsapp": whatsapp,
        "image_url": img_url,
        "timestamp": now,
        "notified_users": [],
        "approved": True
    }

    users_db[email]["ads"].append(ad)
    ads_db.append(ad)

    # Remove expired ads
    one_week_ago = now - timedelta(days=7)
    ads_db[:] = [a for a in ads_db if a["timestamp"] > one_week_ago]

    matched_ads = []
    for a in ads_db:
        if a["email"] != email and set(a["keywords"]) & set(keywords) and a["approved"]:
            matched_ads.append(a)

            # Notify matched user (WhatsApp)
            if a.get("whatsapp") and email not in a["notified_users"]:
                try:
                    twilio_client.messages.create(
                        body="📢 Match found for your ad! View it: https://baobao21.github.io/AdMatcha/",
                        from_=TWILIO_NUMBER,
                        to="whatsapp:" + a["whatsapp"]
                    )
                    a["notified_users"].append(email)
                except Exception as e:
                    print("Twilio error:", e)

            # Notify matched user (Email)
            if a.get("email"):
                try:
                    msg = EmailMessage()
                    msg.set_content("A new ad matched yours! Visit: https://baobao21.github.io/AdMatcha/")
                    msg["Subject"] = "🔔 You Have a Match!"
                    msg["From"] = EMAIL_SENDER
                    msg["To"] = a["email"]
                    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
                        smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
                        smtp.send_message(msg)
                except Exception as e:
                    print("Email error:", e)

    # Notify poster
    if whatsapp:
        try:
            twilio_client.messages.create(
                body="✅ Your ad matched someone! Check it: https://baobao21.github.io/AdMatcha/",
                from_=TWILIO_NUMBER,
                to="whatsapp:" + whatsapp
            )
        except Exception as e:
            print("Twilio error:", e)

    # Return key as `matches` to match frontend expectation
    return JSONResponse(content={"matches": matched_ads})

document.getElementById("adForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const res = await fetch("https://car-match-backend.onrender.com/submit_ad/", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  const matches = document.getElementById("matches");
  matches.innerHTML = "";

  if (data.matched_ads.length === 0) {
    matches.innerHTML = "<p>No matches yet. You’ll be notified on WhatsApp!</p>";
  } else {
    data.matched_ads.forEach(ad => {
      const div = document.createElement("div");
      div.className = "ad-block";
      div.innerHTML = `<b>${ad.text}</b><br>
        ${ad.location || ""}<br>
        ${ad.whatsapp ? "📱 <a href='https://wa.me/" + ad.whatsapp + "' target='_blank'>" + ad.whatsapp + "</a><br>" : ""}
        ${ad.email ? "✉️ " + ad.email + "<br>" : ""}
        ${ad.image_url ? "<img src='" + ad.image_url + "' width='150'>" : ""}
        <hr>`;
      matches.appendChild(div);
    });
  }

  form.reset();
});

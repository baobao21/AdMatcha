document.getElementById("submitBtn").addEventListener("click", async function (e) {
  e.preventDefault();

  const form = document.getElementById("adForm");
  const formData = new FormData(form);

  try {
    const response = await fetch("https://car-match-backend.onrender.com/submit_ad/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!data.matches) {
      alert("❌ Submission failed: " + (data.detail || "Unknown error"));
      return;
    }

    const matchedAds = document.getElementById("matchedAds");
    matchedAds.innerHTML = "";
    data.matches.forEach((ad) => {
      const div = document.createElement("div");
      div.textContent = ad.text;
      if (ad.image_url) {
        const img = document.createElement("img");
        img.src = ad.image_url;
        img.width = 100;
        div.appendChild(img);
      }
      matchedAds.appendChild(div);
    });

    alert("✅ Ad submitted and matched successfully!");
  } catch (err) {
    console.error(err);
    alert("❌ Network or server error occurred.");
  }
});

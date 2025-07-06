document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submitBtn").addEventListener("click", async function (e) {
    e.preventDefault();

    const form = document.getElementById("adForm");
    // Convert form fields to a plain object
    const formData = new FormData(form);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const response = await fetch("https://car-match-backend.onrender.com/submit_ad/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData),  // send JSON string
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const message = errData?.detail || `HTTP ${response.status}`;
        alert("❌ Submission failed: " + message);
        return;
      }

      const data = await response.json();

      if (!data.matches || !Array.isArray(data.matches)) {
        alert("No matches found.");
        return;
      }

      const matchedAds = document.getElementById("matchedAds");
      matchedAds.innerHTML = "";
      data.matches.forEach((ad) => {
        const div = document.createElement("div");
        div.style.padding = "10px";
        div.style.marginTop = "10px";
        div.style.background = "#222";
        div.textContent = ad.text;
        if (ad.image_url) {
          const img = document.createElement("img");
          img.src = ad.image_url;
          img.width = 150;
          div.appendChild(document.createElement("br"));
          div.appendChild(img);
        }
        matchedAds.appendChild(div);
      });

      alert("✅ Ad submitted and matched successfully!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("❌ Network or server error occurred.");
    }
  });
});

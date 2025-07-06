document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submitBtn").addEventListener("click", async function (e) {
    e.preventDefault();

    const form = document.getElementById("adForm");
    const formData = new FormData(form);

    try {
      const response = await fetch("https://car-match-backend.onrender.com/submit_ad/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const message = errData?.detail || `HTTP ${response.status}`;  // ✅ fixed here
        alert("❌ Submission failed: " + message);
        return;
      }

      const data = await response.json();

      // Display matched ads
      const matchedAdsDiv = document.getElementById("matchedAds");
      matchedAdsDiv.innerHTML = "";

      if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
        data.matches.forEach(ad => {
          const div = document.createElement("div");
          div.style.marginTop = "10px";
          div.style.padding = "10px";
          div.style.backgroundColor = "#333";
          div.style.color = "#fff";
          div.textContent = ad.text;
          matchedAdsDiv.appendChild(div);
        });
      } else {
        matchedAdsDiv.textContent = "No matching ads found.";
      }

      alert("✅ Ad submitted successfully!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("❌ Network or server error occurred.");
    }
  });
});

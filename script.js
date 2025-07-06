document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("adForm");
  const matchedAdsDiv = document.getElementById("matchedAds");

  document.getElementById("submitBtn").addEventListener("click", async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const email = formData.get("email");

    try {
      const response = await fetch("https://car-match-backend.onrender.com/submit_ad/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const message = errData?.detail || `HTTP ${response.status}`;
        alert("❌ Submission failed: " + message);
        return;
      }

      const data = await response.json();
      alert("✅ Ad submitted successfully!");
      form.reset();

      // Fetch and show all ads from this user
      const adsRes = await fetch(`https://car-match-backend.onrender.com/user_ads/?email=${email}`);
      const userAds = await adsRes.json();

      matchedAdsDiv.innerHTML = "<h3>Your Posted Ads:</h3>";
      userAds.forEach(ad => {
        const div = document.createElement("div");
        div.textContent = `📢 ${ad.text} (${ad.location || "No location"})`;
        div.style.marginBottom = "10px";
        matchedAdsDiv.appendChild(div);
      });

    } catch (err) {
      console.error(err);
      alert("❌ Network or server error occurred.");
    }
  });
});

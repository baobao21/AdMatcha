// 🟦 SUBMIT FORM LOGIC
document.getElementById("adForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const res = await fetch("https://car-match-backend.onrender.com/submit_ad/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to submit ad.");
    }

    const data = await res.json();
    alert("✅ Ad submitted successfully!");

    // Show matches if any
    if (data.matches.length) {
      const matchedDiv = document.getElementById("matchedAds");
      matchedDiv.innerHTML = "<h3>🎯 Matched Ads</h3>";

      data.matches.forEach(ad => {
        const wrapper = document.createElement("div");
        wrapper.className = "ad-box";

        wrapper.innerHTML = `
          <p><strong>${ad.text}</strong></p>
          <p>📍 ${ad.location || "N/A"}</p>
          <p>📞 <a href="https://wa.me/${ad.whatsapp}" target="_blank">${ad.whatsapp}</a></p>
          ${ad.image_url ? `<img src="${ad.image_url}" alt="Ad Image" />` : ""}
        `;
        matchedDiv.appendChild(wrapper);
      });
    }

    form.reset();
  } catch (err) {
    alert("❌ Failed to submit ad.");
    console.error(err);
  }
});

// 🟦 SEARCH ADS BUTTON LOGIC
document.getElementById("searchBtn").addEventListener("click", async function () {
  const searchResultsDiv = document.getElementById("searchResults");
  searchResultsDiv.innerHTML = "<p>Loading ads...</p>";

  try {
    const response = await fetch("https://car-match-backend.onrender.com/all_ads/");
    const ads = await response.json();

    if (!ads.length) {
      searchResultsDiv.innerHTML = "<p>No ads found.</p>";
      return;
    }

    searchResultsDiv.innerHTML = "<h3>📋 All Recent Ads</h3>";

    ads.forEach(ad => {
      const wrapper = document.createElement("div");
      wrapper.className = "ad-box";

      const title = document.createElement("div");
      title.textContent = ad.text;
      title.className = "ad-title";

      const details = document.createElement("div");
      details.className = "ad-details";
      details.innerHTML = `
        <p><strong>📍 Location:</strong> ${ad.location || "N/A"}</p>
        <p><strong>📞 WhatsApp:</strong> <a href="https://wa.me/${ad.whatsapp}" target="_blank">${ad.whatsapp}</a></p>
        <p><strong>📨 Email:</strong> ${ad.email}</p>
        ${ad.image_url ? `<img src="${ad.image_url}" alt="Ad Image" />` : ""}
      `;

      title.addEventListener("click", () => {
        details.style.display = details.style.display === "none" ? "block" : "none";
      });

      wrapper.appendChild(title);
      wrapper.appendChild(details);
      searchResultsDiv.appendChild(wrapper);
    });

  } catch (err) {
    console.error(err);
    searchResultsDiv.innerHTML = "<p>❌ Failed to load ads.</p>";
  }
});

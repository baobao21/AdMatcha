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
      wrapper.style.marginBottom = "20px";
      wrapper.style.border = "1px solid #fff";
      wrapper.style.padding = "10px";
      wrapper.style.borderRadius = "8px";

      const title = document.createElement("div");
      title.textContent = ad.text;
      title.style.cursor = "pointer";
      title.style.fontWeight = "bold";
      title.style.color = "#ffe600";

      const details = document.createElement("div");
      details.style.display = "none";
      details.style.marginTop = "10px";
      details.innerHTML = `
        <p><strong>📍 Location:</strong> ${ad.location || "N/A"}</p>
        <p><strong>📞 WhatsApp:</strong> <a href="https://wa.me/${ad.whatsapp}" target="_blank">${ad.whatsapp}</a></p>
        <p><strong>📨 Email:</strong> ${ad.email}</p>
        ${ad.image_url ? `<img src="${ad.image_url}" style="max-width:100%; border-radius:8px;">` : ""}
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

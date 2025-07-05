const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", async () => {
  const adText = document.getElementById("adText").value;
  const imageFile = document.getElementById("imageInput").files[0];
  const formData = new FormData();

  formData.append("user_id", "web_user_123");
  formData.append("text", adText);
  if (imageFile) {
    formData.append("file", imageFile);
  }

  const response = await fetch("https://car-match-backend.onrender.com/submit_ad/", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (data.matched_ads.length === 0) {
    resultsDiv.innerHTML = "<p>No matches found.</p>";
  } else {
    data.matched_ads.forEach(ad => {
      const adBlock = document.createElement("div");
      adBlock.innerHTML = `
        <p>${ad.text}</p>
        ${ad.image_url ? `<img src="${ad.image_url}" />` : ""}
        <hr/>
      `;
      resultsDiv.appendChild(adBlock);
    });
  }
});

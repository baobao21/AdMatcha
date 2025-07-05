document.getElementById("submitBtn").addEventListener("click", async () => {
  const text = document.getElementById("adText").value;
  const image = document.getElementById("imageInput").files[0];
  const formData = new FormData();

  formData.append("user_id", "web_user_123");
  formData.append("text", text);
  if (image) {
    formData.append("file", image);
  }

  try {
    const response = await fetch("https://car-match-backend.onrender.com/submit_ad/", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    const container = document.getElementById("results");
    container.innerHTML = "";

    if (data.matched_ads.length === 0) {
      container.innerText = "No matches found.";
    } else {
      data.matched_ads.forEach(ad => {
        const div = document.createElement("div");
        div.innerHTML = `<p>${ad.text}</p>` +
                        (ad.image_url ? `<img src="${ad.image_url}" />` : "");
        container.appendChild(div);
      });
    }
  } catch (error) {
    alert("Submission failed. Check your backend or internet.");
    console.error(error);
  }
});

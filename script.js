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
        const message = errData?.detail || HTTP ${response.status};
        alert("❌ Submission failed: " + message);
        return;
      }

      const data = await response.json();

      // Process the response as needed
      alert("✅ Ad submitted successfully!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("❌ Network or server error occurred.");
    }
  });
});

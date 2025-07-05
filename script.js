document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  // Validate required fields
  const text = document.getElementById('text-input').value.trim();
  const phone = document.getElementById('phone-input').value.trim();
  if (!text || !phone) {
    alert('Please provide both a description and WhatsApp number.');
    return;
  }
  // Build FormData
  const formData = new FormData();
  formData.append('text', text);
  formData.append('location', document.getElementById('location-input').value.trim());
  formData.append('phone', phone);
  formData.append('email', document.getElementById('email-input').value.trim());
  const fileInput = document.getElementById('file-input');
  if (fileInput.files[0]) {
    formData.append('image', fileInput.files[0]);
  }
  
  try {
    const response = await fetch('https://car-match-backend.onrender.com/submit_ad/', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      // Try to parse JSON error if any
      let err = `Error ${response.status}`;
      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const errData = await response.json().catch(() => null);
        if (errData && errData.message) err = errData.message;
      }
      throw new Error(err);
    }
    const data = await response.json();
    // Display matches
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (Array.isArray(data.matches)) {
      data.matches.forEach(match => {
        const card = document.createElement('div');
        card.textContent = `Match: ${match.title} (${match.location}) - Contact: ${match.phone}`;
        resultsDiv.appendChild(card);
      });
    } else {
      resultsDiv.textContent = 'No matches found.';
    }
  } catch (error) {
    console.error(error);
    alert('Submission failed: ' + error.message);
  }
});

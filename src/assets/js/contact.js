(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;

  var workerUrl = form.dataset.workerUrl;
  var submitButton = form.querySelector('button[type="submit"]');
  var statusEl = form.querySelector('.form-status');
  var originalButtonText = submitButton.textContent;

  function showError(message) {
    statusEl.textContent = message;
    statusEl.classList.add('is-error');
  }

  function clearError() {
    statusEl.textContent = '';
    statusEl.classList.remove('is-error');
  }

  function showSuccess() {
    var confirmation = document.createElement('p');
    confirmation.className = 'form-success';
    confirmation.setAttribute('role', 'status');
    confirmation.setAttribute('tabindex', '-1');
    confirmation.textContent = "Thanks — we'll be in touch shortly.";
    form.replaceWith(confirmation);
    confirmation.focus();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearError();

    var formData = new FormData(form);
    var payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      website: formData.get('website'),
      'cf-turnstile-response': formData.get('cf-turnstile-response'),
    };

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok || !data.ok) {
            throw new Error(data.error || 'Something went wrong. Please try again.');
          }
          showSuccess();
        });
      })
      .catch(function (error) {
        showError(error.message || 'Something went wrong. Please try again.');
        if (window.turnstile) window.turnstile.reset();
      })
      .finally(function () {
        if (document.body.contains(submitButton)) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
  });
})();

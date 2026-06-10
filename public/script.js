// ===== LOGIN FORM (personalaccount.html) =====
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passport = document.getElementById('login-passport').value.trim();
    const phone = document.getElementById('login-phone').value.trim();
    const errorDiv = document.getElementById('login-error');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passport_id: passport, phone })
      });
      const data = await res.json();

      if (data.success) {
        alert('Вход выполнен!'); // or redirect: window.location.href = '/dashboard.html'
      } else {
        errorDiv.style.display = 'block';
      }
    } catch {
      errorDiv.style.display = 'block';
    }
  });
}

// ===== CONTACT FORMS (index.html, contacts.html) =====
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect data – adjust selectors if you add IDs/classes
    const surname = form.querySelector('input[placeholder*="Фамилия"]')?.value || '';
    const name = form.querySelector('input[placeholder*="Имя"]')?.value || '';
    const email = form.querySelector('input[type="email"]')?.value || '';
    const phone = form.querySelector('input[type="tel"]')?.value || '';
    const topicInput = form.querySelector('input[name="topic"]:checked');
    const topic = topicInput ? topicInput.value : '';
    const message = form.querySelector('textarea')?.value || '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surname, name, email, phone, topic, message })
      });
      const data = await res.json();
      if (data.success) {
        alert('Спасибо! Ваше сообщение отправлено.');
        form.reset();
      } else {
        alert('Ошибка отправки. Попробуйте позже.');
      }
    } catch {
      alert('Ошибка отправки.');
    }
  });
});

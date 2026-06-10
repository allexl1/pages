// ================= АВТОРИЗАЦИЯ (проверка при загрузке любой страницы) =================
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return;

  try {
    const res = await fetch('/api/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      showLoggedInHeader(data.user.passport_id);
    } else {
      localStorage.removeItem('authToken');
    }
  } catch (e) {
    // нет соединения – оставляем как есть
  }
});
// Бургер-меню
const burger = document.querySelector('.burger-menu');
const nav = document.querySelector('.header-nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
  });
  // Закрытие при клике на ссылку
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}
function showLoggedInHeader(displayName) {
  // Меняем кнопку «Личный кабинет» на имя пользователя
  const cabinetBtn = document.querySelector('.btn-cabinet');
  if (cabinetBtn) {
    cabinetBtn.textContent = displayName;
    cabinetBtn.href = '/dashboard.html';
    cabinetBtn.classList.remove('active');
  }

  // Не добавляем кнопку «Выйти» на странице личного кабинета (там свой выход)
  const isDashboard = window.location.pathname.endsWith('/dashboard.html') ||
                      window.location.pathname.endsWith('/history.html') ||
                      window.location.pathname.endsWith('/settings.html');
  if (isDashboard) return;

  const headerNav = document.querySelector('.header-nav');
  if (headerNav && !document.getElementById('logout-btn')) {
    const logoutLink = document.createElement('a');
    logoutLink.id = 'logout-btn';
    logoutLink.href = '#';
    logoutLink.textContent = 'Выйти';
    logoutLink.className = 'btn-cabinet';
    logoutLink.style.backgroundColor = '#cc0000';
    logoutLink.style.marginLeft = '8px';
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('authToken');
      window.location.href = '/index.html';
    });
    headerNav.appendChild(logoutLink);
  }
}

// ================= ФОРМА ВХОДА (personalaccount.html) =================
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
        localStorage.setItem('authToken', data.token);
        window.location.href = '/dashboard.html';
      } else {
        errorDiv.style.display = 'block';
      }
    } catch {
      errorDiv.style.display = 'block';
    }
  });
}

// ================= ФОРМЫ ОБРАТНОЙ СВЯЗИ (index.html, contacts.html) =================
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
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

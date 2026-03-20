/**
 * СТРАНИЦА РЕГИСТРАЦИИ
 */

class RegisterPage {
  constructor() {
    this.init();
  }

  init() {
    this.initForm();
    this.addPasswordToggle();
    this.addPasswordStrengthMeter();
  }

  initForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('register-username')?.value;
      const email = document.getElementById('register-email')?.value;
      const so2Id = document.getElementById('register-so2Id')?.value;
      const password = document.getElementById('register-password')?.value;
      const confirmPassword = document.getElementById('register-confirm-password')?.value;
      const agreeTerms = document.querySelector('input[name="agree_terms"]')?.checked;
      const notifications = document.querySelector('input[name="notifications"]')?.checked;

      // Валидация
      if (!username || !email || !so2Id || !password || !confirmPassword) {
        notify('Пожалуйста, заполните все обязательные поля', 'error');
        return;
      }

      if (username.length < 3 || username.length > 20) {
        notify('Имя пользователя должно быть от 3 до 20 символов', 'error');
        return;
      }

      if (!this.isValidEmail(email)) {
        notify('Введите корректный email адрес', 'error');
        return;
      }

      if (!/^\d+$/.test(so2Id)) {
        notify('Standoff 2 ID должен содержать только цифры', 'error');
        return;
      }

      if (password.length < 8) {
        notify('Пароль должен быть не менее 8 символов', 'error');
        return;
      }

      if (password !== confirmPassword) {
        notify('Пароли не совпадают', 'error');
        return;
      }

      if (!agreeTerms) {
        notify('Вы должны согласиться с правилами форума', 'error');
        return;
      }

      // Показываем загрузку
      const submitBtn = document.querySelector('.btn--submit');
      submitBtn.classList.add('btn--loading');

      try {
        // Регистрируем пользователя
        const user = ForumDB.registerUser({
          username,
          email,
          so2Id,
          password,
          notifications
        });

        setTimeout(() => {
          submitBtn.classList.remove('btn--loading');
          notify('Регистрация успешна!', 'success');

          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        }, 1000);

      } catch (error) {
        submitBtn.classList.remove('btn--loading');
        notify(error.message, 'error');
      }
    });
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  addPasswordToggle() {
    document.querySelectorAll('input[type="password"]').forEach(input => {
      const wrapper = document.createElement('div');
      wrapper.className = 'password-wrapper';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);

      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'password-toggle';
      toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
      toggleBtn.setAttribute('aria-label', 'Показать пароль');
      wrapper.appendChild(toggleBtn);

      toggleBtn.addEventListener('click', () => {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        toggleBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
      });
    });
  }

  addPasswordStrengthMeter() {
    const passwordInput = document.getElementById('register-password');
    if (!passwordInput) return;

    const meter = document.createElement('div');
    meter.className = 'password-strength';
    meter.innerHTML = `
      <div class="strength-meter">
        <div class="strength-meter-fill"></div>
      </div>
      <div class="strength-text"></div>
    `;
    passwordInput.parentNode.appendChild(meter);

    passwordInput.addEventListener('input', () => {
      const score = this.checkPasswordStrength(passwordInput.value);
      this.updateStrengthMeter(score);
    });
  }

  checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  }

  updateStrengthMeter(score) {
    const meter = document.querySelector('.strength-meter-fill');
    const text = document.querySelector('.strength-text');
    if (!meter || !text) return;

    const levels = ['Слишком слабый', 'Слабый', 'Средний', 'Хороший', 'Сильный', 'Очень сильный'];
    const colors = ['#ff4757', '#ff6b81', '#ffa502', '#ffd32a', '#2ed573', '#27ae60'];

    meter.style.width = (score / 6) * 100 + '%';
    meter.style.backgroundColor = colors[score] || colors[0];
    text.textContent = levels[score] || levels[0];
  }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new RegisterPage();
});

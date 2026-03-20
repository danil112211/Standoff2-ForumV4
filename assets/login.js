/**
 * СТРАНИЦА ВХОДА
 */

class LoginPage {
  constructor() {
    this.init();
  }

  init() {
    this.initForm();
    this.addSocialAuthHandlers();
    this.addRememberMeLogic();
  }

  initForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('login-email')?.value;
      const password = document.getElementById('login-password')?.value;
      const remember = document.querySelector('input[name="remember"]')?.checked;

      if (!email || !password) {
        notify('Пожалуйста, заполните все поля', 'error');
        return;
      }

      // Показываем загрузку
      const submitBtn = document.querySelector('.btn--submit');
      submitBtn.classList.add('btn--loading');

      try {
        // Пытаемся войти
        const user = ForumDB.loginUser(email, password);

        // Сохраняем сессию
        ForumDB.saveSession(user, remember);

        setTimeout(() => {
          submitBtn.classList.remove('btn--loading');
          notify('Вход выполнен успешно!', 'success');

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

  addSocialAuthHandlers() {
    document.querySelectorAll('.btn--social').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        notify('Вход через соцсети будет доступен позже', 'info');
      });
    });
  }

  addRememberMeLogic() {
    const rememberCheckbox = document.querySelector('input[name="remember"]');
    if (!rememberCheckbox) return;

    // Проверяем, есть ли сохраненная сессия
    const session = localStorage.getItem('currentUser');
    if (session) {
      rememberCheckbox.checked = true;
    }
  }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new LoginPage();
});

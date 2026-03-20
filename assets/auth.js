/**
 * МОДУЛЬ АВТОРИЗАЦИИ
 * Подключается на всех страницах для отображения состояния пользователя
 */

class AuthManager {
  constructor() {
    this.user = ForumDB.loadSession();
    this.init();
  }

  init() {
    this.updateAll(); // Один метод для всего
    this.initLogoutHandler();
  }

  /**
   * ОБНОВИТЬ ВСЁ СРАЗУ
   * Шапка, мобильное меню, кнопка на главной
   */
  updateAll() {
    this.updateHeader();
    this.updateMobileMenu();
    this.updateHeroButton();
  }

  /**
   * ОБНОВИТЬ ШАПКУ САЙТА (с сохранением иконок)
   */
  updateHeader() {
    const authSection = document.querySelector('.header__auth');
    if (!authSection) return;

    // Сохраняем блок с иконками, если он есть
    const iconsBlock = authSection.querySelector('.header__icons');
    const iconsHTML = iconsBlock ? iconsBlock.outerHTML : this.getDefaultIcons();

    if (this.user) {
      // Пользователь авторизован
      authSection.innerHTML = `
        ${iconsHTML}
        <div class="header__user">
          <a href="profile.html?id=${this.user.id}" class="header__user-link">
            <img src="${this.user.avatar || 'assets/avatars/default.jpg'}"
                 alt="${this.user.name}"
                 class="header__avatar">
            <span class="header__username">${this.user.name}</span>
          </a>
          <button class="btn btn-logout header__logout" id="logoutBtn">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      `;
    } else {
      // Гость
      authSection.innerHTML = `
        ${iconsHTML}
        <a href="login.html" class="btn btn-login header__btn" aria-label="Войти на форум">
          <i class="fas fa-sign-in-alt" aria-hidden="true"></i> Войти
        </a>
        <a href="register.html" class="btn btn-register header__btn" aria-label="Зарегистрироваться">
          <i class="fas fa-user-plus" aria-hidden="true"></i> Регистрация
        </a>
      `;
    }

    // Переинициализируем обработчик выхода (т.к. кнопка новая)
    this.initLogoutHandler();
  }

  /**
   * Получить HTML иконок по умолчанию
   */
  getDefaultIcons() {
    return `
      <div class="header__icons">
        <a href="messages.html" class="header__icon" title="Сообщения">
          <i class="fas fa-envelope"></i>
          <span class="header__badge" id="messagesBadge">0</span>
        </a>
        <a href="notifications.html" class="header__icon" title="Уведомления">
          <i class="fas fa-bell"></i>
          <span class="header__badge" id="notificationsBadge">0</span>
        </a>
        <a href="favorites.html" class="header__icon" title="Избранное">
          <i class="fas fa-heart"></i>
        </a>
      </div>
    `;
  }

  /**
   * ОБНОВИТЬ КНОПКУ "ПРИСОЕДИНИТЬСЯ" НА ГЛАВНОЙ
   */
  updateHeroButton() {
    const heroBtn = document.querySelector('.hero__btn[href="register.html"]');
    if (!heroBtn) return; // Если кнопки нет на странице - выходим

    if (this.user) {
      heroBtn.href = 'profile.html';
      heroBtn.innerHTML = `
        <i class="fas fa-user" aria-hidden="true"></i>
        Мой профиль
      `;
      heroBtn.classList.remove('btn-primary');
      heroBtn.classList.add('btn-secondary');
    } else {
      heroBtn.href = 'register.html';
      heroBtn.innerHTML = `
        <i class="fas fa-gamepad hero__btn-icon" aria-hidden="true"></i>
        Присоединиться
      `;
      heroBtn.classList.remove('btn-secondary');
      heroBtn.classList.add('btn-primary');
    }
  }

  /**
   * ОБНОВИТЬ МОБИЛЬНОЕ МЕНЮ
   */
  updateMobileMenu() {
    const mobileAuth = document.querySelector('.mobile-menu__auth');
    if (!mobileAuth) return;

    if (this.user) {
      mobileAuth.innerHTML = `
        <a href="profile.html?id=${this.user.id}" class="btn btn--primary mobile-menu__btn">
          <i class="fas fa-user"></i> Мой профиль
        </a>
        <button class="btn btn-logout mobile-menu__btn" id="mobileLogoutBtn">
          <i class="fas fa-sign-out-alt"></i> Выйти
        </button>
      `;

      // Добавляем обработчик для кнопки выхода в мобильном меню
      document.getElementById('mobileLogoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });

    } else {
      mobileAuth.innerHTML = `
        <a href="login.html" class="btn btn-login mobile-menu__btn">
          <i class="fas fa-sign-in-alt"></i> Войти
        </a>
        <a href="register.html" class="btn btn-register mobile-menu__btn">
          <i class="fas fa-user-plus"></i> Регистрация
        </a>
      `;
    }
  }

  /**
   * ИНИЦИАЛИЗАЦИЯ ОБРАБОТЧИКА ВЫХОДА
   */
  initLogoutHandler() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      // Убираем старые обработчики, чтобы не было дублирования
      logoutBtn.replaceWith(logoutBtn.cloneNode(true));
      document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  /**
   * ВЫХОД ИЗ АККАУНТА
   */
  logout() {
    ForumDB.logoutUser();
    this.user = null;
    this.updateAll(); // Обновляем всё сразу
    notify('Вы вышли из аккаунта', 'info');

    // Перезагружаем страницу через секунду
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

/**
 * Обновить счетчики уведомлений
 * Вызывать после загрузки данных
 */
function updateBadges() {
  const user = ForumDB.getCurrentUser?.();
  if (!user) return;

  const messagesBadge = document.getElementById('messagesBadge');
  const notificationsBadge = document.getElementById('notificationsBadge');

  // Получаем количество непрочитанных сообщений и уведомлений
  const unreadMessages = ForumDB.getUnreadMessagesCount?.() || 0;
  const unreadNotifications = ForumDB.getUnreadNotificationsCount?.() || 0;

  if (messagesBadge) {
    messagesBadge.textContent = unreadMessages || '';
    messagesBadge.style.display = unreadMessages ? 'block' : 'none';
  }

  if (notificationsBadge) {
    notificationsBadge.textContent = unreadNotifications || '';
    notificationsBadge.style.display = unreadNotifications ? 'block' : 'none';
  }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.authManager = new AuthManager();
  updateBadges(); // Обновляем счетчики
});

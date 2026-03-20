/**
 * ГЛАВНАЯ СТРАНИЦА САЙТА
 * Динамическая загрузка последних тем и статистики
 */

class HomePage {
  constructor() {
    this.topics = ForumDB.getTopics() || [];
    this.init();
  }

  init() {
    this.renderLatestTopics();
    this.renderStats();
    this.renderActiveUsers(); // Добавляем активных пользователей как на форуме
    this.initEventListeners();
  }

  /**
   * ОТРИСОВКА ПОСЛЕДНИХ ТЕМ
   * Показывает 4 самые свежие темы (как в дизайне)
   */
  renderLatestTopics() {
    const container = document.querySelector('.topics__list');
    if (!container) return;

    // Берем последние 4 темы (как в дизайне)
    const latestTopics = [...this.topics]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);

    if (latestTopics.length === 0) {
      container.innerHTML = `
        <li class="topics__item topics__item--empty">
          <div class="empty-state">
            <i class="fas fa-comments empty-state__icon"></i>
            <h3>Пока нет тем</h3>
            <p>Будьте первым! Создайте новую тему</p>
            <a href="create-topic.html" class="btn btn--primary">Создать тему</a>
          </div>
        </li>
      `;
      return;
    }

    container.innerHTML = latestTopics.map(topic => this.renderTopicItem(topic)).join('');
  }

  /**
   * ОТРИСОВКА ОДНОЙ ТЕМЫ
   * Унифицированная версия, совместимая с forum.js
   * @param {Object} topic - объект темы из базы данных
   * @returns {string} HTML разметка темы
   */
  renderTopicItem(topic) {
    // Получаем имя автора по его ID (как в forum.js)
    let authorName = topic.author || 'Пользователь';
    if (typeof ForumDB.getUser === 'function' && topic.authorId) {
      const author = ForumDB.getUser(topic.authorId);
      if (author) authorName = author.name;
    }

    const timeAgo = this.getTimeAgo(topic.date);
    const repliesCount = topic.posts ? Math.max(0, topic.posts.length - 1) : 0;

    // Используем единую структуру с forum.js
    return `
    <li class="topics__item">
      <article class="topic">
        <div class="topic__main">
          <div class="topic__item-title">
            <div class="topic__icon" aria-hidden="true">
              <i class="fas fa-comment-dots"></i>
            </div>
            <h3 class="topic__title">
              <a href="topic.html?id=${topic.id}" class="topic__link">
                ${this.escapeHtml(topic.title)}
              </a>
            </h3>
          </div>

          <div class="topic__content">
            <div class="topic__meta">
              <span class="topic__author">
                <i class="fas fa-user topic__meta-icon" aria-hidden="true"></i>
                ${this.escapeHtml(authorName)}
              </span>
              <span class="topic__categories">
                <i class="fas fa-tag topic__meta-icon" aria-hidden="true"></i>
                ${this.escapeHtml(topic.category)}
              </span>
              <span class="topic__time">
                <i class="far fa-clock topic__meta-icon" aria-hidden="true"></i>
                ${timeAgo}
              </span>
            </div>
          </div>
        </div>

        <div class="topic__stats">
          <span class="topic__replies" aria-label="${repliesCount} ответов">
            <i class="fas fa-comment" aria-hidden="true"></i>
            ${this.formatNumber(repliesCount)}
          </span>
          <span class="topic__views" aria-label="${topic.views || 0} просмотров">
            <i class="fas fa-eye" aria-hidden="true"></i>
            ${this.formatNumber(topic.views || 0)}
          </span>
        </div>
      </article>
    </li>
  `;
  }

  /**
   * ОТРИСОВКА САМЫХ АКТИВНЫХ ПОЛЬЗОВАТЕЛЕЙ
   * Добавлено для единообразия с forum.js
   */
  renderActiveUsers() {
    const container = document.querySelector('.active-users__grid');
    if (!container) return;

    // Проверяем, есть ли метод getUsers
    if (typeof ForumDB.getUsers !== 'function') {
      container.style.display = 'none';
      return;
    }

    const users = ForumDB.getUsers();

    if (!Array.isArray(users) || users.length === 0) {
      container.innerHTML = '<p class="empty-state__message">Нет данных об активности</p>';
      return;
    }

    // Сортируем по количеству сообщений и берем топ-6
    const activeUsers = [...users]
      .sort((a, b) => (b.posts || 0) - (a.posts || 0))
      .slice(0, 6);

    container.innerHTML = activeUsers.map(user => `
      <a href="profile.html?id=${user.id}" class="active-user-card">
        <div class="active-user-card__avatar">
          <img src="${user.avatar || 'assets/avatars/default.jpg'}"
               alt="${this.escapeHtml(user.name)}"
               class="active-user-card__avatar-img">
        </div>
        <div class="active-user-card__info">
          <div class="active-user-card__name">${this.escapeHtml(user.name)}</div>
          <div class="active-user-card__stats">
            <span class="active-user-card__posts">
              <i class="fas fa-comment"></i>
              ${user.posts || 0}
            </span>
            <span class="active-user-card__reputation">
              <i class="fas fa-star"></i>
              ${user.reputation || 0}
            </span>
          </div>
        </div>
      </a>
    `).join('');
  }

  /**
   * ОТРИСОВКА СТАТИСТИКИ В HERO СЕКЦИИ
   * Обновлена для единообразия с forum.js
   */
  renderStats() {
    const totalTopics = this.topics.length;
    const totalPosts = this.topics.reduce((sum, topic) => sum + (topic.posts?.length || 0), 0);

    // Получаем количество пользователей (как в forum.js)
    let totalUsers = 15432; // заглушка
    if (typeof ForumDB.getTotalUsers === 'function') {
      totalUsers = ForumDB.getTotalUsers();
    } else if (typeof ForumDB.getUsers === 'function') {
      const users = ForumDB.getUsers();
      totalUsers = Array.isArray(users) ? users.length : 15432;
    }

    // Обновляем числа в hero секции
    const statsNumbers = document.querySelectorAll('.hero__number');
    if (statsNumbers.length >= 3) {
      this.animateNumber(statsNumbers[0], totalUsers);
      this.animateNumber(statsNumbers[1], totalTopics);
      this.animateNumber(statsNumbers[2], this.getOnlineUsers());
    }
  }

  /**
   * АНИМАЦИЯ ЧИСЛА
   * @param {Element} element - DOM элемент для анимации
   * @param {number} target - целевое число
   */
  animateNumber(element, target) {
    if (!element) return;

    const dataCount = element.getAttribute('data-count');
    if (dataCount) {
      element.setAttribute('data-count', target);
    }

    let current = 0;
    const steps = 60;
    const stepValue = target / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += stepValue;

      if (step >= steps) {
        element.textContent = this.formatNumber(target);
        clearInterval(timer);
      } else {
        element.textContent = this.formatNumber(Math.floor(current));
      }
    }, 16);
  }

  /**
   * ПОЛУЧИТЬ КОЛИЧЕСТВО ОНЛАЙН ПОЛЬЗОВАТЕЛЕЙ (имитация)
   * @returns {number} случайное число от 50 до 150
   */
  getOnlineUsers() {
    return Math.floor(Math.random() * 100) + 50; // 50-150
  }

  /**
   * ИНИЦИАЛИЗАЦИЯ ОБРАБОТЧИКОВ
   */
  initEventListeners() {
    // Кнопка "Показать все темы"
    const showAllBtn = document.querySelector('.section-bottom .btn');
    if (showAllBtn) {
      showAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'forum.html';
      });
    }

    // Анимация при наведении на карточки категорий
    document.querySelectorAll('.categories__card').forEach(card => {
      card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px)';
      });
      card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
      });
    });
  }

  /**
   * ФОРМАТИРОВАНИЕ ЧИСЕЛ
   * @param {number} num - число для форматирования
   * @returns {string} отформатированное число (1.2K, 500 и т.д.)
   */
  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * ПОЛУЧИТЬ ОТНОСИТЕЛЬНОЕ ВРЕМЯ
   * @param {string} dateString - дата в строковом формате
   * @returns {string} относительное время (2 часа назад, вчера и т.д.)
   */
  getTimeAgo(dateString) {
    if (!dateString) return 'неизвестно';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} ${this.plural(diffMins, 'минута', 'минуты', 'минут')} назад`;
    if (diffHours < 24) return `${diffHours} ${this.plural(diffHours, 'час', 'часа', 'часов')} назад`;
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} ${this.plural(diffDays, 'день', 'дня', 'дней')} назад`;

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * ПЛЮРАЛИЗАЦИЯ
   * @param {number} n - число
   * @param {string} one - форма для 1 (час)
   * @param {string} two - форма для 2-4 (часа)
   * @param {string} five - форма для 5-20 (часов)
   * @returns {string} правильная форма слова
   */
  plural(n, one, two, five) {
    n = Math.abs(n);
    n %= 100;
    if (n >= 5 && n <= 20) return five;
    n %= 10;
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return two;
    return five;
  }

  /**
   * ЭСКАПИРОВАНИЕ HTML (защита от XSS)
   * @param {string} str - строка для экранирования
   * @returns {string} безопасная строка
   */
  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

/**
 * ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
 */
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, что мы на главной странице
  if (document.querySelector('.topics__list')) {
    new HomePage();
  }
});

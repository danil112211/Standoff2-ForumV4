/**
 * ГЛАВНАЯ СТРАНИЦА ФОРУМА
 * Отображает все категории и последние темы
 */

class ForumPage {
  constructor() {
    this.topics = ForumDB.getTopics() || [];
    this.categories = [
      {
        name: 'Обсуждение игры',
        icon: 'fa-comments',
        color: 'linear-gradient(135deg, #667eea, #764ba2)',
        description: 'Общие темы, новости, обновления и обсуждение геймплея'
      },
      {
        name: 'Поиск команды',
        icon: 'fa-users',
        color: 'linear-gradient(135deg, #f093fb, #f5576c)',
        description: 'Найдите напарников по рангу или создайте киберспортивную команду'
      },
      {
        name: 'Торговля',
        icon: 'fa-exchange-alt',
        color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        description: 'Обсуждение скинов, обмен и торговля внутриигровыми предметами'
      },
      {
        name: 'Гайды',
        icon: 'fa-book',
        color: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        description: 'Полезные руководства, тактики и советы для новичков и профи'
      },
      {
        name: 'Киберспорт',
        icon: 'fa-trophy',
        color: 'linear-gradient(135deg, #fa709a, #fee140)',
        description: 'Турниры, соревнования, профессиональные команды и трансляции'
      },
      {
        name: 'Медиа',
        icon: 'fa-camera',
        color: 'linear-gradient(135deg, #a8edea, #fed6e3)',
        description: 'Скриншоты, видео, мемы и творчество сообщества'
      }
    ];

    this.init();
  }

  /**
   * ИНИЦИАЛИЗАЦИЯ
   * Запускает все методы при создании класса
   */
  init() {
    this.renderCategories();
    this.renderLatestTopics();
    this.renderActiveUsers();
    this.initEventListeners();
    this.checkUrlParams(); // Проверяем параметры URL при загрузке
  }

  /**
   * ОТРИСОВКА САМЫХ АКТИВНЫХ ПОЛЬЗОВАТЕЛЕЙ
   * Показывает топ-6 пользователей по количеству сообщений
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

    // Проверяем, что users - это массив
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
               alt="${user.name}"
               class="active-user-card__avatar-img">
        </div>
        <div class="active-user-card__info">
          <div class="active-user-card__name">${user.name}</div>
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
   * ОТРИСОВКА КАТЕГОРИЙ ФОРУМА
   * Создает карточки категорий с подсчетом тем и сообщений
   */
  renderCategories() {
    const container = document.querySelector('.categories__grid');
    if (!container) return;

    container.innerHTML = this.categories.map(category => {
      const topicsInCategory = this.topics.filter(t => t.category === category.name);
      const postsCount = topicsInCategory.reduce((sum, topic) => sum + (topic.posts?.length || 0), 0);

      return `
        <div class="categories__card" data-category="${category.name}">
          <div class="categories__icon" style="background: ${category.color};">
            <i class="fas ${category.icon} categories__icon-img" aria-hidden="true"></i>
          </div>
          <h3 class="categories__subtitle">
            <a href="?category=${encodeURIComponent(category.name)}" class="categories__link">${category.name}</a>
          </h3>
          <p class="categories__descr">${category.description}</p>
          <div class="categories__stats">
            <span class="categories__stats-text" aria-label="${topicsInCategory.length} тем">
              <i class="fas fa-file-alt categories__stats-icon" aria-hidden="true"></i>
              ${this.formatNumber(topicsInCategory.length)} тем
            </span>
            <span class="categories__stats-text" aria-label="${postsCount} сообщений">
              <i class="fas fa-comment categories__stats-icon" aria-hidden="true"></i>
              ${this.formatNumber(postsCount)} сообщений
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * ОТРИСОВКА ПОСЛЕДНИХ ТЕМ
   * Показывает 5 самых свежих тем
   */
  renderLatestTopics() {
    const container = document.querySelector('.topics__list');
    if (!container) return;

    if (this.topics.length === 0) {
      container.innerHTML = '<li class="topics__item topics__item--empty">Нет тем для отображения</li>';
      return;
    }

    // Берем последние 5 тем
    const latestTopics = [...this.topics]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    container.innerHTML = latestTopics.map(topic => this.renderTopicItem(topic)).join('');
  }

  /**
   * ОТРИСОВКА ОДНОЙ ТЕМЫ
   * @param {Object} topic - объект темы из базы данных
   * @returns {string} HTML разметка темы
   */
  renderTopicItem(topic) {
    // Получаем имя автора по его ID
    const author = typeof ForumDB.getUser === 'function' ? ForumDB.getUser(topic.authorId) : null;
    const authorName = author ? author.name : (topic.author || 'Пользователь');

    const lastPost = topic.posts?.[topic.posts.length - 1] || {};
    const lastPostDate = lastPost.date ? new Date(lastPost.date).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }) : '';

    const repliesCount = topic.posts ? Math.max(0, topic.posts.length - 1) : 0;

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
                  ${topic.title}
                </a>
              </h3>
            </div>

            <div class="topic__content">
              <div class="topic__meta">
                <span class="topic__author">
                  <i class="fas fa-user topic__meta-icon" aria-hidden="true"></i>
                  ${authorName}
                </span>
                <span class="topic__categories">
                  <i class="fas fa-tag topic__meta-icon" aria-hidden="true"></i>
                  ${topic.category}
                </span>
                <span class="topic__time">
                  <i class="far fa-clock topic__meta-icon" aria-hidden="true"></i>
                  ${this.getTimeAgo(topic.date)}
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
   * ИНИЦИАЛИЗАЦИЯ ОБРАБОТЧИКОВ СОБЫТИЙ
   * Добавляет все обработчики для интерактивных элементов
   */
  initEventListeners() {
    // Поиск по форуму (при вводе)
    const searchInput = document.querySelector('.forum-search__input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e));

      // Поиск по Enter
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch(e);
        }
      });
    }

    // Кнопка поиска (лупа)
    const searchBtn = document.querySelector('.forum-actions .btn--primary');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const input = document.querySelector('.forum-search__input');
        if (input && input.value.trim()) {
          this.handleSearch({ target: input });
        }
      });
    }

    // Фильтр по категориям
    const categoryLinks = document.querySelectorAll('.categories__link');
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const card = link.closest('.categories__card');
        const category = card?.dataset.category;
        if (category) {
          this.filterByCategory(category);
        }
      });
    });

    // Кнопка создания темы
    const createBtn = document.querySelector('.forum-actions__create');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        if (ForumDB.isAuthenticated && !ForumDB.isAuthenticated()) {
          notify('Чтобы создать тему, нужно войти в аккаунт', 'info');
          setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
          window.location.href = 'create-topic.html';
        }
      });
    }

    // Кнопка "Показать все темы"
    const showAllBtn = document.getElementById('show-all-topics');
    if (showAllBtn) {
      showAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showAllTopics();
      });
    }
  }
  /**
   * ПРОВЕРКА ПАРАМЕТРОВ URL
   * Проверяет, есть ли параметр category в URL и применяет фильтр
   */
  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category) {
      // Небольшая задержка, чтобы DOM успел отрисоваться
      setTimeout(() => {
        this.filterByCategory(category);

        // Плавно скроллим к списку тем через 300мс (после отрисовки)
        setTimeout(() => {
          const topicsSection = document.querySelector('.topics-section');
          if (topicsSection) {
            topicsSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });

      }, 100);
    }
  }

  /**
   * ПОИСК ПО ТЕМАМ
   * @param {Event} e - событие ввода
   */
  handleSearch(e) {
    const input = e.target;
    const query = input.value.trim();

    if (query.length >= 2) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  }

  /**
   * ФИЛЬТРАЦИЯ ПО КАТЕГОРИИ
   * @param {string} category - название категории
   */
  filterByCategory(category) {
    const filteredTopics = this.topics.filter(t => t.category === category);

    const container = document.querySelector('.topics__list');
    if (!container) return;

    if (filteredTopics.length > 0) {
      container.innerHTML = filteredTopics.map(topic => this.renderTopicItem(topic)).join('');
    } else {
      container.innerHTML = `
      <li class="topics__item topics__item--empty">
        <div class="empty-state">
          <i class="fas fa-folder-open empty-state__icon"></i>
          <h3>В этой категории пока нет тем</h3>
          <p>Будьте первым, кто создаст тему в "${category}"</p>
          <button class="btn btn--primary create-first-topic">Создать тему</button>
        </div>
      </li>
    `;

      document.querySelector('.create-first-topic')?.addEventListener('click', () => {
        window.location.href = 'create-topic.html';
      });
    }

    // Подсвечиваем активную категорию
    document.querySelectorAll('.categories__card').forEach(card => {
      card.classList.toggle('active', card.dataset.category === category);
    });

    // Удаляем старую кнопку сброса, если есть
    document.querySelector('.filter-reset')?.remove();

    if (typeof notify === 'function') {
      notify(`Показаны темы из категории "${category}"`, 'info');
    }
  }

  /**
   * ПОКАЗАТЬ ВСЕ ТЕМЫ
   * Сбрасывает фильтр и показывает все темы
   */
  showAllTopics() {
    const container = document.querySelector('.topics__list');
    if (!container) return;

    // Сортируем по дате (новые сверху)
    const allTopics = [...this.topics].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = allTopics.map(topic => this.renderTopicItem(topic)).join('');

    // Убираем подсветку с категорий
    document.querySelectorAll('.categories__card').forEach(card => {
      card.classList.remove('active');
    });

    // Удаляем кнопку сброса фильтра, если есть

    if (typeof notify === 'function') {
      notify('Показаны все темы', 'info');
    }
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

    return date.toLocaleDateString('ru-RU');
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
}

/**
 * ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
 */
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, что класс существует и страница подходит
  if (document.querySelector('.forum-actions, .categories__grid')) {
    new ForumPage();
  }
});

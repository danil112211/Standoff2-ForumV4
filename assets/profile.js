/**
 * СТРАНИЦА ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ
 */

class ProfilePage {
  constructor() {
    this.userId = this.getUserIdFromUrl();
    this.user = null;
    this.userTopics = [];
    this.userPosts = [];

    if (!this.userId) {
      this.showError('Пользователь не указан');
      return;
    }

    this.init();
  }

  getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
      // Если ID не указан, пробуем показать текущего пользователя
      const currentUser = ForumDB.getCurrentUser?.();
      return currentUser?.id || null;
    }

    return id;
  }

  init() {
    this.loadUserData();
    if (!this.user) return;

    this.renderProfile();
    this.renderStats();
    this.renderTopics();
    this.renderActivity();
    this.renderAbout();
    this.renderActions();
    this.initEventListeners();

  } renderAbout() {
    document.getElementById('about-name').textContent = this.user.name;
    document.getElementById('about-rank').textContent = this.user.rank || 'Пользователь';

    const registered = new Date(this.user.registered).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    document.getElementById('about-registered').textContent = registered;

    // Эти поля можно заполнить позже из дополнительных данных пользователя
    document.getElementById('about-game-rank').textContent = this.user.gameRank || 'Легенда';
    document.getElementById('about-weapon').textContent = this.user.favoriteWeapon || 'AWP';
  }
  renderActions() {
    const actionsContainer = document.querySelector('.profile-actions');
    const messageBtn = document.querySelector('.profile-header__message');

    if (!actionsContainer) return;

    const currentUser = ForumDB.getCurrentUser?.();
    const isOwnProfile = currentUser && currentUser.id == this.userId;

    if (isOwnProfile) {
      // Свой профиль
      if (messageBtn) messageBtn.style.display = 'none';
      actionsContainer.style.display = 'flex';
    } else {
      // Чужой профиль - показываем кнопку "Написать сообщение"
      if (messageBtn) {
        messageBtn.style.display = 'flex';

        // Добавляем обработчик
        messageBtn.replaceWith(messageBtn.cloneNode(true));
        document.querySelector('.profile-header__message')?.addEventListener('click', () => {
          // Перенаправляем на страницу сообщений с открытым диалогом
          window.location.href = `messages.html?user=${this.userId}`;
        });
      }
      actionsContainer.style.display = 'none';
    }
  }
  loadUserData() {
    this.user = ForumDB.getUser(this.userId);
    if (!this.user) {
      this.showError('Пользователь не найден');
      return;
    }

    this.userTopics = ForumDB.getUserTopics(this.userId);
    this.userPosts = ForumDB.getUserPosts(this.userId);

    // Обновляем заголовок страницы
    document.title = `Профиль ${this.user.name} - Standoff 2 Forum`;
  }

  renderProfile() {
    // Аватар - проверяем все возможные элементы аватара
    const avatarElements = document.querySelectorAll('.profile-header__avatar-img, .profile-avatar__img, .avatar-preview img');
    const avatarSrc = this.user.avatar || 'assets/avatars/default.jpg';

    avatarElements.forEach(avatarImg => {
      if (avatarImg) {
        avatarImg.src = avatarSrc;
        avatarImg.alt = `Аватар пользователя ${this.user.name}`;
      }
    });

    // Имя пользователя
    const nameElement = document.querySelector('.profile-header__name');
    if (nameElement) {
      nameElement.textContent = this.user.name;
    }

    // Ранг
    const rankElement = document.querySelector('.profile-header__rank');
    if (rankElement) {
      rankElement.textContent = this.user.rank || 'Пользователь';
    }

    // Даты
    const joinedDate = document.querySelector('.profile-info__joined');
    if (joinedDate) {
      const date = new Date(this.user.registered).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      joinedDate.innerHTML = `<i class="fas fa-calendar-alt"></i> На форуме с ${date}`;
    }

    // Последняя активность
    const lastActive = document.querySelector('.profile-info__last-active');
    if (lastActive) {
      lastActive.innerHTML = `<i class="fas fa-clock"></i> Был(а) онлайн: только что`;
    }
  }

  renderStats() {
    // Количество сообщений
    const postsCount = document.querySelector('.profile-stats__value--posts');
    if (postsCount) {
      postsCount.textContent = this.userPosts.length;
    }

    // Количество тем
    const topicsCount = document.querySelector('.profile-stats__value--topics');
    if (topicsCount) {
      topicsCount.textContent = this.userTopics.length;
    }

    // Репутация
    const reputation = document.querySelector('.profile-stats__value--reputation');
    if (reputation) {
      const rep = this.calculateReputation();
      reputation.textContent = rep;
    }

    // Дней на форуме
    const daysOnForum = document.querySelector('.profile-stats__value--days');
    if (daysOnForum) {
      const days = this.getDaysOnForum();
      daysOnForum.textContent = days;
    }
  }

  calculateReputation() {
    // Простая формула: лайки * 2 + количество тем * 5
    const totalLikes = this.userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
    return totalLikes * 2 + this.userTopics.length * 5;
  }

  getDaysOnForum() {
    const registered = new Date(this.user.registered);
    const now = new Date();
    const diffTime = Math.abs(now - registered);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  renderTopics() {
    const container = document.querySelector('.profile-topics__list');
    if (!container) return;

    if (this.userTopics.length === 0) {
      container.innerHTML = `
        <li class="profile-topics__empty">
          <i class="fas fa-folder-open"></i>
          <p>Пользователь ещё не создавал тем</p>
        </li>
      `;
      return;
    }

    // Показываем последние 5 тем
    const latestTopics = this.userTopics.slice(0, 5);

    container.innerHTML = latestTopics.map(topic => `
      <li class="profile-topics__item">
        <a href="topic.html?id=${topic.id}" class="profile-topics__link">
          <i class="fas fa-comment"></i>
          ${topic.title}
        </a>
        <span class="profile-topics__date">
          ${this.formatDate(topic.date)}
        </span>
      </li>
    `).join('');
  }

  renderActivity() {
    const container = document.querySelector('.profile-activity__list');
    if (!container) return;

    if (this.userPosts.length === 0) {
      container.innerHTML = `
      <li class="profile-activity__empty">
        <i class="fas fa-history"></i>
        <p>Нет активности</p>
      </li>
    `;
      return;
    }

    // Получаем все темы для поиска названий
    const allTopics = ForumDB.getTopics();

    // Показываем последние 10 сообщений
    const latestPosts = this.userPosts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    container.innerHTML = latestPosts.map(post => {
      // Находим тему, к которой относится пост
      const topic = allTopics.find(t => t.id === post.topicId);
      const topicTitle = topic ? topic.title : 'Тема не найдена';

      return `
      <li class="profile-activity__item">
        <div class="profile-activity__icon">
          <i class="fas fa-reply"></i>
        </div>
        <div class="profile-activity__content">
          <a href="topic.html?id=${post.topicId}#post-${post.id}" class="profile-activity__link">
            ${topicTitle}
          </a>
          <p class="profile-activity__excerpt">
            ${this.getExcerpt(post.content)}
          </p>
          <span class="profile-activity__date">
            ${this.formatDate(post.date)}
          </span>
        </div>
      </li>
    `;
    }).join('');
  }

  getExcerpt(html, length = 100) {
    // Убираем HTML теги и обрезаем текст
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'сегодня';
    } else if (diffDays === 1) {
      return 'вчера';
    } else if (diffDays < 7) {
      return `${diffDays} ${this.plural(diffDays, 'день', 'дня', 'дней')} назад`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }

  plural(n, one, two, five) {
    n = Math.abs(n);
    n %= 100;
    if (n >= 5 && n <= 20) return five;
    n %= 10;
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return two;
    return five;
  }

  initEventListeners() {
    // Переключение табов
    document.querySelectorAll('.profile-tabs__btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Убираем активный класс у всех кнопок
        document.querySelectorAll('.profile-tabs__btn').forEach(b =>
          b.classList.remove('profile-tabs__btn--active')
        );

        // Добавляем активный класс текущей кнопке
        btn.classList.add('profile-tabs__btn--active');

        // Скрываем все табы
        document.querySelectorAll('.profile-tab').forEach(tab =>
          tab.classList.remove('profile-tab--active')
        );

        // Показываем нужный таб
        const tabId = `tab-${btn.dataset.tab}`;
        document.getElementById(tabId)?.classList.add('profile-tab--active');
      });
    });
    // Кнопка "Написать сообщение"
    const messageBtn = document.querySelector('.profile-header__message');
    if (messageBtn) {
      messageBtn.addEventListener('click', () => {
        notify(`Функция отправки сообщения пользователю ${this.user.name} будет доступна позже`, 'info');
      });
    }

    // Кнопка "Все темы"
    const allTopicsBtn = document.querySelector('.profile-topics__all');
    if (allTopicsBtn) {
      allTopicsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `forum.html?author=${this.user.id}`;
      });
    }
  }

  showError(message) {
    const container = document.querySelector('.main .container');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <h2>Ошибка</h2>
          <p>${message}</p>
          <a href="forum.html" class="btn btn--primary">Вернуться на форум</a>
        </div>
      `;
    }
  }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new ProfilePage();
});

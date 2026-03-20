/**
 * СТРАНИЦА ГАЙДА
 * Отображение полного гайда с комментариями и действиями
 */

class GuidePage {
  constructor() {
    this.guideId = null;
    this.guide = null;
    this.author = null;
    this.init();
  }

  init() {
    // Получаем ID гайда из URL
    const urlParams = new URLSearchParams(window.location.search);
    this.guideId = urlParams.get('id');

    if (!this.guideId) {
      window.location.href = 'guides.html';
      return;
    }

    this.guide = ForumDB.getGuide(parseInt(this.guideId));

    if (!this.guide) {
      this.renderNotFound();
      return;
    }

    this.author = ForumDB.getUser(this.guide.authorId) || {
      name: this.guide.author,
      rank: 'Пользователь',
      avatar: 'assets/avatars/default.jpg'
    };

    this.renderGuide();
    this.initEventListeners();
  }

  renderNotFound() {
    const container = document.getElementById('guide-content-container');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <h2>Гайд не найден</h2>
          <p>Возможно, он был удален или никогда не существовал</p>
          <a href="guides.html" class="btn btn--primary">Вернуться к списку гайдов</a>
        </div>
      `;
    }
  }

  renderGuide() {
    const container = document.getElementById('guide-content-container');
    if (!container) return;

    // Обновляем хлебные крошки
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = this.guide.title;
    }

    // Форматируем дату
    const date = new Date(this.guide.createdAt).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Получаем похожие гайды
    const similarGuides = this.getSimilarGuides();

    container.innerHTML = `
      <!-- Шапка гайда -->
      <div class="guide-header">
        <h1 class="guide-header__title">${this.escapeHtml(this.guide.title)}</h1>

        <div class="guide-header__meta">
          <span class="guide-header__category">
            <i class="fas fa-folder"></i>
            ${this.escapeHtml(this.guide.category)}
          </span>
          <span class="guide-header__difficulty guide-header__difficulty--${this.guide.difficulty}">
            <i class="fas fa-signal"></i>
            ${this.guide.difficulty}
          </span>
          <span class="guide-header__stats">
            <span title="Просмотры">
              <i class="fas fa-eye"></i>
              ${this.guide.views}
            </span>
            <span title="Лайки">
              <i class="fas fa-heart"></i>
              <span id="likes-count">${this.guide.likes}</span>
            </span>
            <span title="Время чтения">
              <i class="far fa-clock"></i>
              ${this.guide.timeToRead} мин
            </span>
            <span title="Дата публикации">
              <i class="far fa-calendar"></i>
              ${date}
            </span>
          </span>
        </div>
      </div>

      <!-- Информация об авторе -->
      <div class="guide-author">
        <div class="guide-author__avatar">
          <img src="${this.author.avatar}" alt="${this.escapeHtml(this.author.name)}" class="guide-author__avatar-img">
        </div>
        <div class="guide-author__info">
          <a href="profile.html?id=${this.author.id}" class="guide-author__name">${this.escapeHtml(this.author.name)}</a>
          <div class="guide-author__rank">
            <i class="fas fa-medal"></i>
            ${this.escapeHtml(this.author.rank)}
          </div>
        </div>
      </div>

      <!-- Теги -->
      ${this.guide.tags?.length ? `
        <div class="guide-tags">
          ${this.guide.tags.map(tag => `
            <a href="guides.html?tag=${encodeURIComponent(tag)}" class="guide-tags__tag">#${this.escapeHtml(tag)}</a>
          `).join('')}
        </div>
      ` : ''}

      <!-- Содержание -->
      <div class="guide-content">
        ${this.guide.content}
      </div>

      <!-- Действия -->
      <div class="guide-actions">
        <button class="btn guide-actions__btn guide-actions__btn--like" id="likeBtn">
          <i class="${this.guide.liked ? 'fas' : 'far'} fa-heart"></i>
          <span id="likeBtnText">${this.guide.liked ? 'Вам нравится' : 'Нравится'}</span>
        </button>
        <button class="btn btn--primary guide-actions__btn" id="shareBtn">
          <i class="fas fa-share-alt"></i>
          Поделиться
        </button>
        ${ForumDB.isAuthenticated && ForumDB.isAuthenticated() && ForumDB.getCurrentUser().id === this.author.id ? `
          <button class="btn btn--secondary guide-actions__btn" id="editBtn">
            <i class="fas fa-edit"></i>
            Редактировать
          </button>
        ` : ''}
      </div>

      <!-- Похожие гайды -->
      ${similarGuides.length ? `
        <div class="related-guides">
          <h2 class="related-guides__title">Похожие гайды</h2>
          <div class="related-guides__grid">
            ${similarGuides.map(similar => `
              <a href="guide.html?id=${similar.id}" class="related-guide">
                <h3 class="related-guide__title">${this.escapeHtml(similar.title)}</h3>
                <div class="related-guide__meta">
                  <span>
                    <i class="fas fa-eye"></i>
                    ${similar.views}
                  </span>
                  <span>
                    <i class="fas fa-heart"></i>
                    ${similar.likes}
                  </span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }

  getSimilarGuides() {
    const allGuides = ForumDB.getGuides ? ForumDB.getGuides() : [];
    return allGuides
      .filter(g => g.id !== this.guide.id && g.category === this.guide.category)
      .slice(0, 4);
  }

  initEventListeners() {
    // Обработчик лайка
    const likeBtn = document.getElementById('likeBtn');
    if (likeBtn) {
      likeBtn.addEventListener('click', () => this.handleLike());
    }

    // Обработчик поделиться
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.handleShare());
    }

    // Обработчик редактирования
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.handleEdit());
    }
  }

  handleLike() {
    if (!ForumDB.isAuthenticated || !ForumDB.isAuthenticated()) {
      notify('Чтобы ставить лайки, нужно войти в аккаунт', 'info');
      setTimeout(() => window.location.href = 'login.html', 1500);
      return;
    }

    this.guide.liked = !this.guide.liked;
    this.guide.likes += this.guide.liked ? 1 : -1;

    if (typeof ForumDB.updateGuide === 'function') {
      ForumDB.updateGuide(this.guide);
    }

    const likeBtn = document.getElementById('likeBtn');
    const icon = likeBtn?.querySelector('i');
    const text = document.getElementById('likeBtnText');
    const count = document.getElementById('likes-count');

    if (icon) icon.className = this.guide.liked ? 'fas fa-heart' : 'far fa-heart';
    if (text) text.textContent = this.guide.liked ? 'Вам нравится' : 'Нравится';
    if (count) count.textContent = this.guide.likes;
  }

  handleShare() {
    navigator.clipboard.writeText(window.location.href);
    if (typeof notify === 'function') {
      notify('Ссылка скопирована в буфер обмена', 'success');
    }
  }

  handleEdit() {
    // TODO: создать страницу редактирования
    if (typeof notify === 'function') {
      notify('Редактирование будет доступно позже', 'info');
    }
  }

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

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new GuidePage();
});

/**
 * СТРАНИЦА ГАЙДОВ
 */

class GuidesPage {
  constructor() {
    this.guides = ForumDB.getGuides();
    this.filters = {
      category: 'all',
      difficulty: 'all',
      sort: 'newest',
      query: ''
    };

    this.init();
  }

  init() {
    this.renderGuides();
    // this.renderFilters();
    this.initEventListeners();
  }

  renderGuides(guides = this.guides) {
    const container = document.querySelector('.guides__grid');
    if (!container) return;

    if (guides.length === 0) {
      container.innerHTML = `
        <div class="guides__empty">
          <i class="fas fa-book-open"></i>
          <h3>Гайды не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
          <button class="btn btn--primary" id="reset-filters">Сбросить фильтры</button>
        </div>
      `;
      return;
    }

    container.innerHTML = guides.map(guide => this.renderGuideCard(guide)).join('');
  }

  renderGuideCard(guide) {
    const timeAgo = this.getTimeAgo(guide.createdAt);

    const difficultyColors = {
      'Новичок': '#2ed573',
      'Средний': '#ffa502',
      'Профи': '#ff4757'
    };

    return `
      <div class="guide-card" data-guide-id="${guide.id}">
        <div class="guide-card__image">
          <img src="${guide.image || 'assets/guides/default.jpg'}"
               alt="${guide.title}"
               class="guide-card__img">
          <div class="guide-card__difficulty" style="background: ${difficultyColors[guide.difficulty]}">
            ${guide.difficulty}
          </div>
          <div class="guide-card__time">
            <i class="far fa-clock"></i>
            ${guide.timeToRead} мин
          </div>
        </div>

        <div class="guide-card__content">
          <div class="guide-card__category">
            <i class="fas fa-folder"></i>
            ${guide.category}
          </div>

          <h3 class="guide-card__title">
            <a href="guide.html?id=${guide.id}" class="guide-card__link">
              ${guide.title}
            </a>
          </h3>

          <p class="guide-card__description">${guide.description}</p>

          <div class="guide-card__tags">
            ${guide.tags.slice(0, 3).map(tag => `
              <span class="guide-card__tag">#${tag}</span>
            `).join('')}
          </div>

          <div class="guide-card__footer">
            <div class="guide-card__author">
              <i class="fas fa-user"></i>
              <a href="profile.html?id=${guide.authorId}" class="guide-card__author-link">
                ${guide.author}
              </a>
            </div>

            <div class="guide-card__stats">
              <span class="guide-card__stat" title="Просмотры">
                <i class="fas fa-eye"></i>
                ${this.formatNumber(guide.views)}
              </span>
              <span class="guide-card__stat" title="Лайки">
                <i class="fas fa-heart"></i>
                ${this.formatNumber(guide.likes)}
              </span>
              <span class="guide-card__stat" title="Рейтинг">
                <i class="fas fa-star"></i>
                ${guide.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div class="guide-card__date">
            <i class="far fa-calendar"></i>
            ${timeAgo}
          </div>
        </div>
      </div>
    `;
  }

  // renderFilters() {
  //   const container = document.querySelector('.filters');
  //   if (!container) return;

  //   container.innerHTML = `
  //     <div class="filters__section">
  //       <h3 class="filters__title">Фильтры</h3>

  //       <div class="filters__group">
  //         <label class="filters__label">Поиск</label>
  //         <div class="filters__search">
  //           <i class="fas fa-search"></i>
  //           <input type="text"
  //                  class="filters__input"
  //                  id="search-query"
  //                  placeholder="Название, теги..."
  //                  value="${this.filters.query}">
  //         </div>
  //       </div>

  //       <div class="filters__group">
  //         <label class="filters__label">Категория</label>
  //         <select class="filters__select" id="filter-category">
  //           <option value="all" ${this.filters.category === 'all' ? 'selected' : ''}>Все</option>
  //           <option value="Оружие" ${this.filters.category === 'Оружие' ? 'selected' : ''}>Оружие</option>
  //           <option value="Карты" ${this.filters.category === 'Карты' ? 'selected' : ''}>Карты</option>
  //           <option value="Тренировки" ${this.filters.category === 'Тренировки' ? 'selected' : ''}>Тренировки</option>
  //           <option value="Тактика" ${this.filters.category === 'Тактика' ? 'selected' : ''}>Тактика</option>
  //           <option value="Настройки" ${this.filters.category === 'Настройки' ? 'selected' : ''}>Настройки</option>
  //         </select>
  //       </div>

  //       <div class="filters__group">
  //         <label class="filters__label">Сложность</label>
  //         <select class="filters__select" id="filter-difficulty">
  //           <option value="all" ${this.filters.difficulty === 'all' ? 'selected' : ''}>Любая</option>
  //           <option value="Новичок" ${this.filters.difficulty === 'Новичок' ? 'selected' : ''}>Новичок</option>
  //           <option value="Средний" ${this.filters.difficulty === 'Средний' ? 'selected' : ''}>Средний</option>
  //           <option value="Профи" ${this.filters.difficulty === 'Профи' ? 'selected' : ''}>Профи</option>
  //         </select>
  //       </div>

  //       <div class="filters__group">
  //         <label class="filters__label">Сортировка</label>
  //         <select class="filters__select" id="filter-sort">
  //           <option value="newest" ${this.filters.sort === 'newest' ? 'selected' : ''}>Сначала новые</option>
  //           <option value="popular" ${this.filters.sort === 'popular' ? 'selected' : ''}>Популярные</option>
  //           <option value="rating" ${this.filters.sort === 'rating' ? 'selected' : ''}>По рейтингу</option>
  //         </select>
  //       </div>

  //       <button class="btn btn--secondary" id="reset-filters">
  //         <i class="fas fa-redo-alt"></i>
  //         Сбросить
  //       </button>
  //     </div>

  //     <div class="filters__actions">
  //       <button class="btn btn--primary" id="create-guide">
  //         <i class="fas fa-plus"></i>
  //         Написать гайд
  //       </button>
  //     </div>
  //   `;
  // }

  initEventListeners() {
    // Поиск
    const searchInput = document.getElementById('search-query');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.query = e.target.value;
        this.applyFilters();
      });
    }

    // Фильтры
    ['category', 'difficulty', 'sort'].forEach(filter => {
      const element = document.getElementById(`filter-${filter}`);
      if (element) {
        element.addEventListener('change', (e) => {
          this.filters[filter] = e.target.value;
          this.applyFilters();
        });
      }
    });

    // Кнопка сброса
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFilters());
    }

    // Кнопка создания гайда
    const createBtn = document.getElementById('create-guide');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        window.location.href = 'create-guide.html';
      });
    }

    // Лайки (будут работать после авторизации)
    document.querySelectorAll('.guide-card__stat .fa-heart').forEach(heart => {
      heart.addEventListener('click', (e) => {
        e.preventDefault();
        notify('Чтобы ставить лайки, нужно войти на сайт', 'info');
      });
    });
  }

  applyFilters() {
    const filteredGuides = ForumDB.searchGuides({
      category: this.filters.category !== 'all' ? this.filters.category : null,
      difficulty: this.filters.difficulty !== 'all' ? this.filters.difficulty : null,
      sort: this.filters.sort,
      query: this.filters.query || null
    });

    this.renderGuides(filteredGuides);
    this.initEventListeners(); // Переподключаем обработчики
  }

  resetFilters() {
    this.filters = {
      category: 'all',
      difficulty: 'all',
      sort: 'newest',
      query: ''
    };

    // Обновляем UI
    document.getElementById('search-query').value = '';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-difficulty').value = 'all';
    document.getElementById('filter-sort').value = 'newest';

    this.renderGuides(this.guides);
    this.initEventListeners();
  }

  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getTimeAgo(dateString) {
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
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} ${this.plural(Math.floor(diffDays / 7), 'неделю', 'недели', 'недель')} назад`;
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
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new GuidesPage();
});

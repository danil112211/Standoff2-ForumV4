// assets/search.js
console.log('✅ search.js загружен');

class SearchPage {
  constructor() {
    this.searchInput = document.getElementById('searchInput');
    this.searchBtn = document.getElementById('searchBtn');
    this.resultsDiv = document.getElementById('searchResults');
    this.filterTopics = document.getElementById('filterTopics');
    this.filterGuides = document.getElementById('filterGuides');

    this.topics = [];
    this.guides = [];

    this.init();
  }

  init() {
    // Загружаем данные с проверкой
    try {
      this.topics = ForumDB.getTopics ? ForumDB.getTopics() : [];
      this.guides = ForumDB.getGuides ? ForumDB.getGuides() : [];
    } catch (e) {
      console.error('Ошибка загрузки данных:', e);
      this.topics = [];
      this.guides = [];
    }

    this.initEventListeners();
    this.checkUrlQuery();
  }

  initEventListeners() {
    // Поиск по кнопке
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => this.performSearch());
    }

    // Поиск по Enter
    if (this.searchInput) {
      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.performSearch();
      });
    }

    // Фильтры (обновляем результаты при изменении)
    if (this.filterTopics) {
      this.filterTopics.addEventListener('change', () => this.performSearch());
    }
    if (this.filterGuides) {
      this.filterGuides.addEventListener('change', () => this.performSearch());
    }
  }

  checkUrlQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q');

    if (urlQuery && this.searchInput) {
      this.searchInput.value = urlQuery;
      // Небольшая задержка для загрузки данных
      setTimeout(() => this.performSearch(), 100);
    }
  }

  performSearch() {
    const query = this.searchInput?.value.trim().toLowerCase();

    if (!query) {
      notify('Введите запрос', 'warning');
      return;
    }

    const results = [];
    const searchTopics = this.filterTopics ? this.filterTopics.checked : true;
    const searchGuides = this.filterGuides ? this.filterGuides.checked : true;

    // Поиск по темам
    if (searchTopics) {
      this.topics.forEach(topic => {
        const matchTitle = topic.title?.toLowerCase().includes(query);
        const matchContent = topic.posts?.some(post =>
          post.content?.toLowerCase().includes(query)
        );

        if (matchTitle || matchContent) {
          // Находим отрывок текста с запросом
          let excerpt = '';
          if (matchContent) {
            const post = topic.posts.find(p =>
              p.content?.toLowerCase().includes(query)
            );
            if (post) {
              excerpt = this.getExcerpt(post.content, query);
            }
          } else {
            excerpt = topic.posts?.[0]?.content?.substring(0, 200) || '';
          }

          results.push({
            type: 'topic',
            typeText: 'Тема',
            icon: 'fa-comment',
            id: topic.id,
            title: topic.title,
            author: topic.author || 'Неизвестно',
            authorId: topic.authorId,
            date: topic.date,
            excerpt: excerpt,
            category: topic.category || 'Обсуждение',
            replies: topic.posts?.length || 0,
            views: topic.views || 0
          });
        }
      });
    }

    // Поиск по гайдам
    if (searchGuides) {
      this.guides.forEach(guide => {
        const matchTitle = guide.title?.toLowerCase().includes(query);
        const matchDesc = guide.description?.toLowerCase().includes(query);
        const matchContent = guide.content?.toLowerCase().includes(query);

        if (matchTitle || matchDesc || matchContent) {
          results.push({
            type: 'guide',
            typeText: 'Гайд',
            icon: 'fa-book',
            id: guide.id,
            title: guide.title,
            author: guide.author || 'Неизвестно',
            authorId: guide.authorId,
            rating: guide.rating || 0,
            excerpt: guide.description || '',
            date: guide.createdAt,
            category: guide.category || 'Обучение',
            difficulty: guide.difficulty || 'Средний'
          });
        }
      });
    }

    this.displayResults(results, query);
  }

  getExcerpt(content, query, length = 200) {
    if (!content) return '';

    // Убираем HTML теги
    const text = content.replace(/<[^>]*>/g, '');

    // Находим позицию запроса
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text.substring(0, length) + '...';

    // Берем кусок текста вокруг запроса
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    let excerpt = text.substring(start, end);

    if (start > 0) excerpt = '...' + excerpt;
    if (end < text.length) excerpt += '...';

    return excerpt;
  }

  highlightText(text, query) {
    if (!query || !text) return text;
    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    } catch (e) {
      return text;
    }
  }

  formatDate(dateString) {
    if (!dateString) return 'недавно';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'сегодня';
      if (diffDays === 1) return 'вчера';
      if (diffDays < 5) return `${diffDays} дня назад`;
      if (diffDays < 21) return `${diffDays} дней назад`;

      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }

  pluralDays(n) {
    n = Math.abs(n);
    if (n >= 5 && n <= 20) return 'дней';
    n %= 10;
    if (n === 1) return 'день';
    if (n >= 2 && n <= 4) return 'дня';
    return 'дней';
  }

  displayResults(results, query) {
    if (!this.resultsDiv) return;

    if (results.length === 0) {
      this.resultsDiv.innerHTML = `
        <div class="search-empty">
          <i class="fas fa-search search-empty__icon"></i>
          <h3 class="search-empty__title">Ничего не найдено</h3>
          <p class="search-empty__descr">По запросу "${query}" ничего нет</p>
          <button class="btn btn--secondary" id="clearSearchBtn">
            <i class="fas fa-times"></i> Очистить поиск
          </button>
        </div>
      `;

      document.getElementById('clearSearchBtn')?.addEventListener('click', () => {
        if (this.searchInput) {
          this.searchInput.value = '';
          this.searchInput.focus();
        }
        this.resultsDiv.innerHTML = '';
      });

      return;
    }

    // Сортируем по дате (новые сверху)
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    this.resultsDiv.innerHTML = `
      <div class="search-results__info">
        Найдено результатов: ${results.length}
      </div>
      <div class="search-results__list">
        ${results.map(item => this.renderResultItem(item, query)).join('')}
      </div>
    `;
  }

  renderResultItem(item, query) {
    return `
      <div class="search-result-card search-result-card--${item.type}">
        <div class="search-result__type ${item.type}">
          <i class="fas ${item.icon}"></i> ${item.typeText}
        </div>

        <a href="${item.type}.html?id=${item.id}" class="search-result__title">
          ${this.highlightText(item.title, query)}
        </a>

        <div class="search-result__excerpt">
          ${this.highlightText(item.excerpt, query)}
        </div>

        <div class="search-result__meta">
          <span class="search-result__author">
            <i class="fas fa-user"></i>
            <a href="profile.html?id=${item.authorId}">${item.author}</a>
          </span>

          <span class="search-result__category">
            <i class="fas fa-folder"></i> ${item.category}
          </span>

          <span class="search-result__date">
            <i class="far fa-clock"></i> ${this.formatDate(item.date)}
          </span>

          ${item.type === 'topic' ? `
            <span class="search-result__stats">
              <i class="fas fa-comment"></i> ${item.replies}
              <i class="fas fa-eye"></i> ${this.formatNumber(item.views)}
            </span>
          ` : ''}

          ${item.rating ? `
            <span class="search-result__rating">
              <i class="fas fa-star"></i> ${item.rating.toFixed(1)}
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }

  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.searchPage = new SearchPage();
});

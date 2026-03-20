/**
 * СТРАНИЦА ТОРГОВЛИ
 */

class TradePage {
  constructor() {
    this.trades = ForumDB.getTrades();
    this.filters = {
      type: 'all',
      category: 'all',
      rarity: 'all',
      minPrice: '',
      maxPrice: '',
      statTrak: false,
      query: ''
    };

    this.init();
  }

  init() {
    this.renderTrades();
    // this.renderFilters();
    this.initEventListeners();
  }

  renderTrades(trades = this.trades) {
    const container = document.querySelector('.trades__grid');
    if (!container) return;

    if (trades.length === 0) {
      container.innerHTML = `
        <div class="trades__empty">
          <i class="fas fa-search"></i>
          <h3>Объявления не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
          <button class="btn btn--primary" id="reset-filters">Сбросить фильтры</button>
        </div>
      `;
      return;
    }

    container.innerHTML = trades.map(trade => this.renderTradeCard(trade)).join('');
  }

  // В функции renderTradeCard:
  renderTradeCard(trade) {
    return `
    <div class="trade-card">
      ${trade.type ? `
        <div class="trade-card__badge trade-card__badge--${trade.type}">
          ${trade.type === 'sell' ? 'Продажа' : trade.type === 'buy' ? 'Покупка' : 'Обмен'}
        </div>
      ` : ''}

      <!-- ✅ ИЗОБРАЖЕНИЕ -->
      <div class="trade-card__image">
        <img src="${trade.image || 'assets/trades/default.jpg'}"
             alt="${trade.title}"
             class="trade-card__img"
             <img src="${trade.image || 'assets/trades/default.jpg'}"
     alt="${trade.title}"
     class="trade-card__img"
     onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\' viewBox=\'0 0 200 200\'%3E%3Crect width=\'200\' height=\'200\' fill=\'%23333\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23666\' font-size=\'14\'%3E%D0%9D%D0%B5%D0%B2%D0%B0%D0%BB%D0%B8%D0%B4%D0%BD%D0%BE%D0%B5%20%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%3C/text%3E%3C/svg%3E'">
      </div>

      <div class="trade-card__content">
        <h3 class="trade-card__title">${trade.title}</h3>

        <div class="trade-card__meta">
          <span class="trade-card__category">
            <i class="fas fa-folder"></i> ${this.getCategoryName(trade.category)}
          </span>
          <span class="trade-card__rarity">
            <i class="fas fa-star"></i> ${trade.rarity || 'Обычный'}
          </span>
        </div>

        <!-- Блок с наклейками -->
        ${trade.stickers ? `
          <div class="trade-card__stickers">
            <div class="stickers__count">
              <i class="fas fa-sticky-note"></i> ${trade.stickers} наклеек
            </div>
            <div class="stickers__list">
              ${trade.stickerNames?.map(name => `
                <span class="sticker-tag">${name}</span>
              `).join('') || ''}
            </div>
          </div>
        ` : ''}

        <div class="trade-card__price">
          <span class="trade-card__price-value">${trade.price?.toLocaleString()}</span>
          <span class="trade-card__price-currency">💰</span>
        </div>

        <p class="trade-card__description">${trade.description || ''}</p>

        <div class="trade-card__footer">
          <a href="profile.html?id=${trade.sellerId || '#'}" class="trade-card__seller">
            <i class="fas fa-user"></i> ${trade.seller || 'Неизвестно'}
          </a>
          <div class="trade-card__stats">
            <span class="trade-card__stat">
              <i class="fas fa-eye"></i> ${this.formatNumber(trade.views || 0)}
            </span>
            <span class="trade-card__stat">
              <i class="fas fa-heart"></i> ${this.formatNumber(trade.likes || 0)}
            </span>
          </div>
        </div>

        <div class="trade-card__time">
          <i class="far fa-clock"></i> ${this.getTimeAgo(trade.createdAt)}
        </div>
      </div>

      <button class="btn btn--primary trade-card__btn" data-trade-id="${trade.id}">
        ${trade.type === 'sell' ? 'Купить' : trade.type === 'buy' ? 'Продать' : 'Предложить'}
      </button>
    </div>
  `;
  }

  renderFilters() {
    const container = document.querySelector('.filters');
    if (!container) return;

    container.innerHTML = `
      <div class="filters__section">
        <h3 class="filters__title">Фильтры</h3>

        <div class="filters__group">
          <label class="filters__label">Поиск</label>
          <div class="filters__search">
            <i class="fas fa-search"></i>
            <input type="text"
                   class="filters__input"
                   id="search-query"
                   placeholder="Название или продавец..."
                   value="${this.filters.query}">
          </div>
        </div>

        <div class="filters__group">
          <label class="filters__label">Тип</label>
          <select class="filters__select" id="filter-type">
            <option value="all" ${this.filters.type === 'all' ? 'selected' : ''}>Все</option>
            <option value="sell" ${this.filters.type === 'sell' ? 'selected' : ''}>Продажа</option>
            <option value="buy" ${this.filters.type === 'buy' ? 'selected' : ''}>Покупка</option>
            <option value="exchange" ${this.filters.type === 'exchange' ? 'selected' : ''}>Обмен</option>
          </select>
        </div>

        <div class="filters__group">
          <label class="filters__label">Категория</label>
          <select class="filters__select" id="filter-category">
            <option value="all" ${this.filters.category === 'all' ? 'selected' : ''}>Все</option>
            <option value="knife" ${this.filters.category === 'knife' ? 'selected' : ''}>Ножи</option>
            <option value="rifle" ${this.filters.category === 'rifle' ? 'selected' : ''}>Винтовки</option>
            <option value="pistol" ${this.filters.category === 'pistol' ? 'selected' : ''}>Пистолеты</option>
            <option value="smg" ${this.filters.category === 'smg' ? 'selected' : ''}>Пистолеты-пулеметы</option>
          </select>
        </div>

        <div class="filters__group">
          <label class="filters__label">Редкость</label>
          <select class="filters__select" id="filter-rarity">
            <option value="all" ${this.filters.rarity === 'all' ? 'selected' : ''}>Все</option>
            <option value="common" ${this.filters.rarity === 'common' ? 'selected' : ''}>Обычный</option>
            <option value="rare" ${this.filters.rarity === 'rare' ? 'selected' : ''}>Редкий</option>
            <option value="epic" ${this.filters.rarity === 'epic' ? 'selected' : ''}>Эпический</option>
            <option value="legendary" ${this.filters.rarity === 'legendary' ? 'selected' : ''}>Легендарный</option>
            <option value="mythical" ${this.filters.rarity === 'mythical' ? 'selected' : ''}>Мифический</option>
          </select>
        </div>

        <div class="filters__group">
          <label class="filters__label">Цена (золото)</label>
          <div class="filters__price">
            <input type="number"
                   class="filters__input filters__price-input"
                   id="price-min"
                   placeholder="От"
                   value="${this.filters.minPrice}"
                   min="0">
            <span class="filters__price-separator">—</span>
            <input type="number"
                   class="filters__input filters__price-input"
                   id="price-max"
                   placeholder="До"
                   value="${this.filters.maxPrice}"
                   min="0">
          </div>
        </div>

        <div class="filters__group">
          <label class="filters__checkbox">
            <input type="checkbox" id="filter-stattrak" ${this.filters.statTrak ? 'checked' : ''}>
            <span class="filters__checkbox-text">Только StatTrak</span>
          </label>
        </div>

        <button class="btn btn--secondary" id="reset-filters">
          <i class="fas fa-redo-alt"></i>
          Сбросить
        </button>
      </div>

      <div class="filters__actions">
        <button class="btn btn--primary" id="create-trade">
          <i class="fas fa-plus"></i>
          Создать объявление
        </button>
      </div>
    `;
  }

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
    ['type', 'category', 'rarity'].forEach(filter => {
      const element = document.getElementById(`filter-${filter}`);
      if (element) {
        element.addEventListener('change', (e) => {
          this.filters[filter] = e.target.value;
          this.applyFilters();
        });
      }
    });

    // Цена
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');

    if (priceMin) {
      priceMin.addEventListener('input', (e) => {
        this.filters.minPrice = e.target.value ? parseInt(e.target.value) : '';
        this.applyFilters();
      });
    }

    if (priceMax) {
      priceMax.addEventListener('input', (e) => {
        this.filters.maxPrice = e.target.value ? parseInt(e.target.value) : '';
        this.applyFilters();
      });
    }

    // StatTrak
    const statTrak = document.getElementById('filter-stattrak');
    if (statTrak) {
      statTrak.addEventListener('change', (e) => {
        this.filters.statTrak = e.target.checked;
        this.applyFilters();
      });
    }

    // Кнопка сброса
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFilters());
    }

    // Кнопка создания объявления
    const createBtn = document.getElementById('create-trade');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        window.location.href = 'create-trade.html';
      });
    }

    // Кнопки действий с объявлениями
    document.querySelectorAll('.trade-card__btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tradeId = e.currentTarget.dataset.tradeId;
        this.handleTradeAction(tradeId);
      });
    });
  }

  applyFilters() {
    const filteredTrades = ForumDB.searchTrades({
      type: this.filters.type !== 'all' ? this.filters.type : null,
      category: this.filters.category !== 'all' ? this.filters.category : null,
      rarity: this.filters.rarity !== 'all' ? this.filters.rarity : null,
      minPrice: this.filters.minPrice || null,
      maxPrice: this.filters.maxPrice || null,
      statTrak: this.filters.statTrak,
      query: this.filters.query || null
    });

    this.renderTrades(filteredTrades);
    this.initEventListeners(); // Переподключаем обработчики
  }

  resetFilters() {
    this.filters = {
      type: 'all',
      category: 'all',
      rarity: 'all',
      minPrice: '',
      maxPrice: '',
      statTrak: false,
      query: ''
    };

    // Обновляем UI
    document.getElementById('search-query').value = '';
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-rarity').value = 'all';
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    document.getElementById('filter-stattrak').checked = false;

    this.renderTrades(this.trades);
    this.initEventListeners();
  }

  handleTradeAction(tradeId) {
    const trade = ForumDB.getTrade(tradeId);

    if (!trade) return;

    const messages = {
      sell: `Покупка "${trade.title}"`,
      buy: `Продажа "${trade.title}"`,
      exchange: `Обмен "${trade.title}"`
    };

    // Проверяем авторизацию
    if (!ForumDB.isAuthenticated()) {
      notify('Чтобы продолжить, нужно войти в аккаунт', 'error');
      setTimeout(() => window.location.href = 'login.html', 1500);
      return;
    }

    // Показываем уведомление и меняем стиль кнопки
    notify(`Заявка на ${messages[trade.type].toLowerCase()} отправлена!`, 'success');

    const btn = document.querySelector(`[data-trade-id="${tradeId}"]`);
    if (btn) {
      btn.classList.add('trade-card__btn--sent');
      btn.disabled = true;
      btn.innerHTML = '<span class="btn__text">✓ Заявка отправлена</span>';
    }

    // В реальном проекте здесь будет отправка сообщения продавцу
  }

  getCategoryName(category) {
    const categories = {
      knife: 'Ножи',
      rifle: 'Винтовки',
      pistol: 'Пистолеты',
      smg: 'Пистолеты-пулеметы'
    };
    return categories[category] || category;
  }

  truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
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
  new TradePage();
});

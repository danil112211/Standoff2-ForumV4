/**
 * СТРАНИЦА НОВОСТЕЙ
 * Пагинация новостей по страницам
 */

document.addEventListener('DOMContentLoaded', function () {
  const NEWS_PER_PAGE = 6;

  let currentFilter = 'all';
  let currentPage = 1;
  let filteredNews = [];
  let totalPages = 1;

  // Данные новостей (в реальном проекте будут из базы)
  const newsData = [
    {
      id: 1,
      title: 'Обновление 0.37.0: Новые скины и баланс оружия',
      excerpt: 'В новом обновлении вас ждут M4A1 Dragon\'s Breath, AKR-12 Neon Storm, изменения баланса оружия и улучшение производительности...',
      category: 'update',
      categoryName: 'Обновление',
      date: '2026-03-15',
      comments: 47,
      views: 12400,
      image: 'assets/news/update-037.jpg',
      featured: true
    },
    {
      id: 2,
      title: 'Открытая регистрация на турнир "Legends Cup"',
      excerpt: 'Призовой фонд 100 000 золота. Регистрация открыта до 1 апреля...',
      category: 'event',
      categoryName: 'Событие',
      date: '2026-03-14',
      comments: 23,
      views: 8900,
      image: 'assets/news/tournament.jpg'
    },
    {
      id: 3,
      title: 'Новая коллекция скинов "Dragon\'s Breath"',
      excerpt: '5 новых скинов легендарной редкости уже доступны в кейсах...',
      category: 'skins',
      categoryName: 'Скины',
      date: '2026-03-12',
      comments: 89,
      views: 15600,
      image: 'assets/news/skins.jpg'
    },
    {
      id: 4,
      title: 'Изменения баланса оружия в патче 0.36.9',
      excerpt: 'SMG-08 получил небольшой нерф, Deagle улучшили точность...',
      category: 'update',
      categoryName: 'Обновление',
      date: '2026-03-10',
      comments: 156,
      views: 21300,
      image: 'assets/news/balance.jpg'
    },
    {
      id: 5,
      title: 'Весенний ивент: удвоенный опыт и бонусы',
      excerpt: 'С 20 марта по 10 апреля получайте в 2 раза больше опыта...',
      category: 'event',
      categoryName: 'Событие',
      date: '2026-03-09',
      comments: 34,
      views: 6700,
      image: 'assets/news/event.jpg'
    },
    {
      id: 6,
      title: 'Новая карта "Province" уже в игре',
      excerpt: 'Исследуйте новую карту, вдохновленную европейской провинцией...',
      category: 'update',
      categoryName: 'Обновление',
      date: '2026-03-07',
      comments: 112,
      views: 18900,
      image: 'assets/news/map.jpg'
    },
    {
      id: 7,
      title: 'Акция на пополнение золота',
      excerpt: 'Пополняйте золото с бонусом до 30% до конца месяца',
      category: 'event',
      categoryName: 'Событие',
      date: '2026-03-05',
      comments: 18,
      views: 4300,
      image: 'assets/news/promo.jpg'
    },
    {
      id: 8,
      title: 'Обновление античита и новые правила',
      excerpt: 'Усиленная защита от читеров и обновлённые правила сообщества...',
      category: 'update',
      categoryName: 'Обновление',
      date: '2026-03-03',
      comments: 67,
      views: 9200,
      image: 'assets/news/anticheat.jpg'
    },
    {
      id: 9,
      title: 'Интервью с разработчиками',
      excerpt: 'Эксклюзивное интервью с командой разработки Standoff 2...',
      category: 'event',
      categoryName: 'Событие',
      date: '2026-03-01',
      comments: 145,
      views: 23500,
      image: 'assets/news/interview.jpg'
    },
    {
      id: 10,
      title: 'Новый боевой пропуск "Spring 2026"',
      excerpt: '100 уровней наград, эксклюзивные скины и эмotes...',
      category: 'skins',
      categoryName: 'Скины',
      date: '2026-02-28',
      comments: 201,
      views: 31200,
      image: 'assets/news/battlepass.jpg'
    }
  ];

  // Форматирование даты
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'сегодня';
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дня назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Фильтрация новостей
  function filterNews() {
    filteredNews = currentFilter === 'all'
      ? newsData
      : newsData.filter(news => news.category === currentFilter);

    // Считаем общее количество страниц
    totalPages = Math.ceil(filteredNews.length / NEWS_PER_PAGE);

    // Проверяем, что текущая страница в пределах допустимого
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    // Получаем номер страницы из URL (если есть)
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam) {
      const page = parseInt(pageParam);
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
      }
    }

    loadNews();
  }

  // Загрузка новостей
  function loadNews() {
    const start = (currentPage - 1) * NEWS_PER_PAGE;
    const pageNews = filteredNews.slice(start, start + NEWS_PER_PAGE);

    renderNews(pageNews);
    renderPagination();
    updateURL();
  }

  // Отрисовка новостей
  function renderNews(pageNews) {
    const container = document.querySelector('.news-grid');
    const featuredContainer = document.querySelector('.featured-news');

    // Главная новость (показываем только на первой странице при фильтре "all")
    const featured = newsData.find(n => n.featured);
    if (featured && currentPage === 1 && currentFilter === 'all') {
      featuredContainer.style.display = 'grid';
      featuredContainer.innerHTML = `
        <div class="featured-news__image">
          <img src="${featured.image}" alt="${featured.title}">
        </div>
        <div class="featured-news__content">
          <div class="featured-news__badge">Главная новость</div>
          <h2 class="featured-news__title">
            <a href="news-item.html?id=${featured.id}">${featured.title}</a>
          </h2>
          <p class="featured-news__excerpt">${featured.excerpt}</p>
          <div class="featured-news__meta">
            <span><i class="far fa-calendar"></i> <time datetime="${featured.date}">${formatDate(featured.date)}</time></span>
            <span><i class="fas fa-comment"></i> ${featured.comments}</span>
            <span><i class="fas fa-eye"></i> ${(featured.views / 1000).toFixed(1)}K</span>
          </div>
          <a href="news-item.html?id=${featured.id}" class="btn btn--primary">Читать далее</a>
        </div>
      `;
    } else {
      featuredContainer.style.display = 'none';
    }

    // Остальные новости
    if (pageNews.length === 0) {
      container.innerHTML = '<p class="empty-message">Новости не найдены</p>';
      return;
    }

    container.innerHTML = pageNews.map(item => `
      <article class="news-card">
        <div class="news-card__image">
          <img src="${item.image}" alt="${item.title}">
          <span class="news-card__badge">${item.categoryName}</span>
        </div>
        <div class="news-card__content">
          <h3 class="news-card__title">
            <a href="news-item.html?id=${item.id}">${item.title}</a>
          </h3>
          <p class="news-card__excerpt">${item.excerpt}</p>
          <div class="news-card__meta">
            <span><i class="far fa-calendar"></i> <time datetime="${item.date}">${formatDate(item.date)}</time></span>
            <span><i class="fas fa-comment"></i> ${item.comments}</span>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Отрисовка пагинации
  function renderPagination() {
    const paginationList = document.querySelector('.pagination__list');
    if (!paginationList) return;

    // Если всего 1 страница или меньше, скрываем пагинацию
    if (totalPages <= 1) {
      paginationList.innerHTML = '';
      return;
    }

    let html = '';

    // Кнопка "Назад"
    if (currentPage > 1) {
      html += `
        <li class="pagination__item">
          <a href="#" data-page="${currentPage - 1}" class="pagination__link pagination__prev" aria-label="Предыдущая страница">
            <i class="fas fa-chevron-left" aria-hidden="true"></i>
          </a>
        </li>
      `;
    }

    // Номера страниц
    for (let i = 1; i <= totalPages; i++) {
      // Показываем: первую, последнюю, текущую и по 2 страницы вокруг текущей
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        if (i === currentPage) {
          // Текущая страница (не ссылка)
          html += `
            <li class="pagination__item">
              <span class="pagination__current" aria-current="page">${i}</span>
            </li>
          `;
        } else {
          // Другие страницы (ссылки)
          html += `
            <li class="pagination__item">
              <a href="#" data-page="${i}" class="pagination__link">${i}</a>
            </li>
          `;
        }
      } else if (
        (i === currentPage - 3 && i > 1) ||
        (i === currentPage + 3 && i < totalPages)
      ) {
        // Многоточие
        html += `
          <li class="pagination__item">
            <span class="pagination__dots">...</span>
          </li>
        `;
      }
    }

    // Кнопка "Вперед"
    if (currentPage < totalPages) {
      html += `
        <li class="pagination__item">
          <a href="#" data-page="${currentPage + 1}" class="pagination__link pagination__next" aria-label="Следующая страница">
            <i class="fas fa-chevron-right" aria-hidden="true"></i>
          </a>
        </li>
      `;
    }

    paginationList.innerHTML = html;

    // Добавляем обработчики для всех ссылок пагинации
    paginationList.querySelectorAll('a[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(e.currentTarget.dataset.page);
        goToPage(page);
      });
    });
  }

  // Переход на выбранную страницу
  function goToPage(page) {
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    updateURL();
    loadNews();

    // Плавно скроллим к началу списка новостей
    document.querySelector('.news-header').scrollIntoView({ behavior: 'smooth' });
  }

  // Обновление URL
  function updateURL() {
    const url = new URL(window.location);
    if (currentPage > 1) {
      url.searchParams.set('page', currentPage);
    } else {
      url.searchParams.delete('page');
    }
    window.history.pushState({}, '', url);
  }

  // Фильтрация
  document.querySelectorAll('.news-filter__btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.news-filter__btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filterMap = {
        'Все новости': 'all',
        'Обновления': 'update',
        'События': 'event',
        'Турниры': 'event', // временно
        'Скины': 'skins'
      };

      currentFilter = filterMap[this.textContent] || 'all';
      currentPage = 1;
      filterNews();
    });
  });

  // Инициализация
  filterNews();
});

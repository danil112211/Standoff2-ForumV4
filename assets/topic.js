/**
 * СТРАНИЦА ТЕМЫ ФОРУМА
 * Динамическая загрузка темы по ID из URL
 */

class TopicPage {
  constructor() {
    this.topicId = this.getTopicIdFromUrl();
    this.topic = null;
    this.currentPage = 1; // Текущая страница
    this.postsPerPage = 10; // Сколько сообщений на одной странице
    this.totalPages = 1; // Всего страниц

    if (!this.topicId) {
      this.showError('ID темы не указан');
      return;
    }

    this.init();
  }

  // Получаем ID темы из URL (например: topic.html?id=123)
  getTopicIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  init() {
    try {
      // Показываем загрузку
      this.showLoading();

      // Загружаем тему из базы данных
      this.topic = ForumDB.getTopic(this.topicId);

      if (!this.topic) {
        this.showError('Тема не найдена');
        return;
      }

      // Получаем номер страницы из URL (если есть)
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get('page');
      this.currentPage = pageParam ? parseInt(pageParam) : 1;

      // Обновляем заголовок страницы
      document.title = `${this.topic.title} - Standoff 2 Forum`;

      // Увеличиваем счетчик просмотров
      this.topic.views = (this.topic.views || 0) + 1;
      ForumDB.updateTopic(this.topicId, { views: this.topic.views });

      // Заполняем страницу данными
      this.updateMeta();
      this.renderPosts(); // Отрисовываем сообщения с учетом пагинации
      this.renderPagination(); // Отрисовываем пагинацию
      this.initEventListeners();

    } catch (error) {
      console.error('Ошибка загрузки темы:', error);
      this.showError('Ошибка при загрузке темы');
    }
  }

  // Показываем загрузку
  showLoading() {
    const container = document.querySelector('.posts');
    if (container) {
      container.innerHTML = `
        <div class="loading">
          <div class="loading__spinner"></div>
          <p>Загрузка темы...</p>
        </div>
      `;
    }
  }

  // Показываем ошибку
  showError(message) {
    const container = document.querySelector('.main .container');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <h2>Ошибка</h2>
          <p>${message}</p>
          <a href="forum.html" class="btn btn--primary">Вернуться к списку тем</a>
        </div>
      `;
    }
  }

  // Обновляем мета-информацию
  updateMeta() {
    // Хлебные крошки
    const breadcrumbs = document.querySelector('.breadcrumbs__list');
    if (breadcrumbs) {
      breadcrumbs.innerHTML = `
        <li class="breadcrumbs__item">
          <a href="index.html" class="breadcrumbs__link">Главная</a>
        </li>
        <li class="breadcrumbs__item">
          <a href="forum.html" class="breadcrumbs__link">Форум</a>
        </li>
        <li class="breadcrumbs__item">
          <a href="forum.html?category=${encodeURIComponent(this.topic.category)}" class="breadcrumbs__link">${this.topic.category}</a>
        </li>
        <li class="breadcrumbs__item">
          <span class="breadcrumbs__current" aria-current="page">${this.topic.title}</span>
        </li>
      `;
    }

    // Заголовок темы
    const headerTitle = document.querySelector('.topic-header__title');
    if (headerTitle) {
      headerTitle.textContent = this.topic.title;
    }

    // Мета-информация темы
    const meta = document.querySelector('.topic-header__meta');
    if (meta) {
      const date = new Date(this.topic.date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      meta.innerHTML = `
        <span class="topic-header__category">
          <i class="fas fa-folder" aria-hidden="true"></i>
          <a href="forum.html?category=${encodeURIComponent(this.topic.category)}">${this.topic.category}</a>
        </span>
        <span class="topic-header__date">
          <i class="far fa-calendar" aria-hidden="true"></i>
          Создана: ${date}
        </span>
        <span class="topic-header__views">
          <i class="fas fa-eye" aria-hidden="true"></i>
          ${this.formatNumber(this.topic.views)} просмотров
        </span>
      `;
    }
  }

  // Отрисовываем все сообщения с учетом пагинации
  renderPosts() {
    const container = document.querySelector('.posts');
    if (!container) return;

    if (!this.topic.posts || this.topic.posts.length === 0) {
      container.innerHTML = '<p class="empty-message">В этой теме пока нет сообщений</p>';
      return;
    }

    // Считаем количество страниц
    this.totalPages = Math.ceil(this.topic.posts.length / this.postsPerPage);

    // Проверяем, что текущая страница в пределах допустимого
    if (this.currentPage < 1) this.currentPage = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    // Получаем сообщения для текущей страницы
    const start = (this.currentPage - 1) * this.postsPerPage;
    const end = start + this.postsPerPage;
    const pagePosts = this.topic.posts.slice(start, end);

    // Отрисовываем сообщения
    container.innerHTML = pagePosts.map((post, index) =>
      this.renderPost(post, start + index + 1)
    ).join('');
  }

  // Отрисовываем одно сообщение
  renderPost(post, postNumber) {
    const author = ForumDB.getUser(post.authorId) || {
      name: post.author || 'Пользователь',
      rank: 'Пользователь',
      posts: 0,
      registered: new Date().toISOString(),
      avatar: 'assets/avatars/default.jpg'
    };

    const date = new Date(post.date).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <article class="post" id="post-${post.id}" data-post-id="${post.id}">
        <div class="post__sidebar">
          <div class="post__author">
            <div class="post__avatar">
              <img src="${author.avatar || 'assets/avatars/default.jpg'}" alt="Аватар пользователя ${author.name}" class="post__avatar-img">
            </div>
            <div class="post__author-info">
              <a href="profile.html?id=${author.id}" class="post__author-name">${author.name}</a>
              <span class="post__author-rank">${author.rank}</span>
            </div>
          </div>
          <div class="post__stats">
            <div class="post__stat">
              <i class="fas fa-message" aria-hidden="true"></i>
              <span>${this.formatNumber(author.posts || 0)} сообщений</span>
            </div>
            <div class="post__stat">
              <i class="fas fa-calendar" aria-hidden="true"></i>
              <span>На форуме: ${this.getForumDuration(author.registered)}</span>
            </div>
          </div>
        </div>

        <div class="post__content">
          <div class="post__header">
            <span class="post__number">#${postNumber}</span>
            <time class="post__date" datetime="${post.date}">
              <i class="far fa-clock" aria-hidden="true"></i>
              ${date}
            </time>
          </div>

          <div class="post__body">
            ${post.content}
          </div>

          <div class="post__footer">
            <button class="post__like" data-post-id="${post.id}" aria-label="Нравится">
              <i class="${post.liked ? 'fas' : 'far'} fa-heart" aria-hidden="true"></i>
              <span>${this.formatNumber(post.likes || 0)}</span>
            </button>
            <button class="post__reply" data-post-id="${post.id}" aria-label="Ответить">
              <i class="fas fa-reply" aria-hidden="true"></i>
              <span>Ответить</span>
            </button>
            <button class="post__quote" data-post-id="${post.id}" aria-label="Цитировать">
              <i class="fas fa-quote-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // ОТРИСОВКА ПАГИНАЦИИ - ЭТОТ МЕТОД НУЖНО ДОБАВИТЬ
  renderPagination() {
    const paginationList = document.querySelector('.pagination__list');
    if (!paginationList) return;

    // Если всего 1 страница, скрываем пагинацию
    if (this.totalPages <= 1) {
      paginationList.innerHTML = '';
      return;
    }

    let html = '';

    // Кнопка "Назад" (на предыдущую страницу)
    if (this.currentPage > 1) {
      html += `
        <li class="pagination__item">
          <a href="#" data-page="${this.currentPage - 1}" class="pagination__link pagination__prev" aria-label="Предыдущая страница">
            <i class="fas fa-chevron-left" aria-hidden="true"></i>
          </a>
        </li>
      `;
    }

    // Номера страниц
    for (let i = 1; i <= this.totalPages; i++) {
      // Показываем: первую, последнюю, текущую и по 2 страницы вокруг текущей
      if (
        i === 1 ||
        i === this.totalPages ||
        (i >= this.currentPage - 2 && i <= this.currentPage + 2)
      ) {
        if (i === this.currentPage) {
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
        (i === this.currentPage - 3 && i > 1) ||
        (i === this.currentPage + 3 && i < this.totalPages)
      ) {
        // Многоточие
        html += `
          <li class="pagination__item">
            <span class="pagination__dots">...</span>
          </li>
        `;
      }
    }

    // Кнопка "Вперед" (на следующую страницу)
    if (this.currentPage < this.totalPages) {
      html += `
        <li class="pagination__item">
          <a href="#" data-page="${this.currentPage + 1}" class="pagination__link pagination__next" aria-label="Следующая страница">
            <i class="fas fa-chevron-right" aria-hidden="true"></i>
          </a>
        </li>
      `;
    }

    // Вставляем готовую пагинацию в HTML
    paginationList.innerHTML = html;

    // Добавляем обработчики для всех ссылок пагинации
    paginationList.querySelectorAll('a[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(e.currentTarget.dataset.page);
        this.goToPage(page);
      });
    });
  }

  // Переход на выбранную страницу
  goToPage(page) {
    this.currentPage = page;

    // Обновляем URL (чтобы можно было поделиться ссылкой на конкретную страницу)
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);

    // Перерисовываем сообщения для новой страницы
    this.renderPosts();

    // Перерисовываем пагинацию (обновляем активную страницу)
    this.renderPagination();

    // Обновляем обработчики для кнопок (лайки, ответы и т.д.)
    this.initEventListeners();

    // Плавно скроллим к началу темы
    document.querySelector('.topic-header').scrollIntoView({ behavior: 'smooth' });
  }

  // Инициализируем обработчики событий
  initEventListeners() {
    // Кнопки лайков
    document.querySelectorAll('.post__like').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleLike(e));
    });

    // Кнопки ответа
    document.querySelectorAll('.post__reply').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleReply(e));
    });

    // Кнопки цитирования
    document.querySelectorAll('.post__quote').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleQuote(e));
    });

    // Форма ответа
    const replyForm = document.querySelector('.reply-form');
    if (replyForm) {
      replyForm.addEventListener('submit', (e) => this.handleSubmitReply(e));
    }
  }

  // Обработка лайка
  handleLike(e) {
    const btn = e.currentTarget;
    const postId = btn.dataset.postId;
    const post = this.topic.posts.find(p => p.id == postId);

    if (post) {
      post.liked = !post.liked;
      post.likes = (post.likes || 0) + (post.liked ? 1 : -1);

      // Обновляем иконку и счетчик
      const icon = btn.querySelector('i');
      icon.className = post.liked ? 'fas fa-heart' : 'far fa-heart';
      btn.querySelector('span').textContent = this.formatNumber(post.likes);

      // Сохраняем изменения
      if (ForumDB.updatePost) {
        ForumDB.updatePost(this.topicId, postId, { liked: post.liked, likes: post.likes });
      }

      notify(post.liked ? '❤️ Вы оценили сообщение' : '💔 Оценка убрана', 'info');
    }
  }

  // Обработка ответа
  handleReply(e) {
    const postId = e.currentTarget.dataset.postId;
    const post = this.topic.posts.find(p => p.id == postId);

    const textarea = document.querySelector('.reply-form__textarea');
    if (textarea && post) {
      textarea.value = `@${post.author}, `;
      textarea.focus();
    }
  }

  // Обработка цитирования
  handleQuote(e) {
    const postId = e.currentTarget.dataset.postId;
    const post = this.topic.posts.find(p => p.id == postId);

    // Улучшенный парсинг HTML для цитаты
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;

    // Удаляем лишние теги и нормализуем текст
    const text = tempDiv.textContent || tempDiv.innerText || '';

    // Разбиваем на строки и берём первые несколько значимых строк
    const lines = text.trim().split('\n').filter(line => line.trim().length > 0);
    const shortQuote = lines.slice(0, 3).join('\n');

    // Обрезаем если слишком длинный
    const finalQuote = shortQuote.length > 300
      ? shortQuote.substring(0, 300) + '...'
      : shortQuote;

    const textarea = document.querySelector('.reply-form__textarea');
    if (textarea) {
      textarea.value = `[quote=${post.author}]\n${finalQuote}\n[/quote]\n\n`;
      textarea.focus();
      notify('Цитата добавлена. Отредактируйте при необходимости.', 'info');
    }
  }

  // Отправка ответа
  handleSubmitReply(e) {
    e.preventDefault();

    // Проверяем авторизацию
    if (!ForumDB.isAuthenticated || !ForumDB.isAuthenticated()) {
      notify('Чтобы ответить, нужно войти в аккаунт', 'error');
      setTimeout(() => window.location.href = 'login.html', 1500);
      return;
    }

    const textarea = document.querySelector('.reply-form__textarea');
    const content = textarea.value.trim();

    if (!content) {
      notify('Напишите сообщение', 'error');
      return;
    }

    const currentUser = ForumDB.getCurrentUser();

    // Создаем новый пост
    const newPost = {
      id: this.getNextPostId(),
      author: currentUser.name,
      authorId: currentUser.id,
      content: this.formatMessage(content),
      date: new Date().toISOString(),
      likes: 0,
      liked: false
    };

    // Добавляем в базу данных
    if (ForumDB.addPost) {
      ForumDB.addPost(this.topicId, newPost);
    }

    // Добавляем на страницу
    this.topic.posts.push(newPost);

    // Пересчитываем количество страниц
    const newTotalPages = Math.ceil(this.topic.posts.length / this.postsPerPage);

    // Переходим на последнюю страницу (где новое сообщение)
    this.currentPage = newTotalPages;

    // Обновляем URL
    const url = new URL(window.location);
    url.searchParams.set('page', this.currentPage);
    window.history.pushState({}, '', url);

    // Перерисовываем сообщения и пагинацию
    this.renderPosts();
    this.renderPagination();
    this.initEventListeners();

    // Очищаем форму
    textarea.value = '';

    notify('Ответ добавлен!', 'success');

    // Скроллим к новому сообщению
    setTimeout(() => {
      const lastPost = document.querySelector('.post:last-child');
      if (lastPost) {
        lastPost.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // Получить следующий ID для поста
  getNextPostId() {
    const maxId = Math.max(...this.topic.posts.map(p => p.id), 0);
    return maxId + 1;
  }

  // Форматирование сообщения (простой парсинг BBCode)
  formatMessage(text) {
    // Замена [quote] на blockquote
    text = text.replace(/\[quote=(.+?)\](.+?)\[\/quote\]/gs, '<blockquote><strong>$1 написал:</strong><br>$2</blockquote>');

    // Замена переносов строк на <br>
    text = text.replace(/\n/g, '<br>');

    return text;
  }

  // Форматирование чисел (1000 -> 1K)
  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Получить длительность на форуме
  getForumDuration(registeredDate) {
    if (!registeredDate) return 'Новичок';

    const start = new Date(registeredDate);
    const now = new Date();

    if (isNaN(start.getTime())) return 'Новичок';

    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth();

    if (years > 0) {
      return `${years} ${this.plural(years, 'год', 'года', 'лет')}`;
    } else if (months > 0) {
      return `${months} ${this.plural(months, 'месяц', 'месяца', 'месяцев')}`;
    } else {
      return 'Новичок';
    }
  }

  // Плюрализация (1 год, 2 года, 5 лет)
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
  if (document.querySelector('.topic-header')) {
    new TopicPage();
  }
});

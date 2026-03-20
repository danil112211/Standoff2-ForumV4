/**
 * Универсальные хлебные крошки для всех страниц
 * Автоматически определяются по названию страницы
 */

function renderBreadcrumbs(items) {
  const container = document.querySelector('.breadcrumbs__list');
  if (!container) return;

  let html = '';
  
  // Всегда добавляем главную
  html += `
    <li class="breadcrumbs__item">
      <a href="index.html" class="breadcrumbs__link">
        <i class="fas fa-home"></i> Главная
      </a>
    </li>
  `;

  // Добавляем промежуточные элементы
  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    
    if (isLast) {
      // Текущая страница (не ссылка)
      html += `
        <li class="breadcrumbs__item">
          <span class="breadcrumbs__current" aria-current="page">${item.text}</span>
        </li>
      `;
    } else {
      // Ссылка
      html += `
        <li class="breadcrumbs__item">
          <a href="${item.href}" class="breadcrumbs__link">${item.text}</a>
        </li>
      `;
    }
  });

  container.innerHTML = html;
}

// Авто-определение хлебных крошек по странице
function initAutoBreadcrumbs() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  const breadcrumbsMap = {
    'index.html': [],
    'news.html': [
      { text: 'Новости', href: 'news.html' }
    ],
    'forum.html': [
      { text: 'Форум', href: 'forum.html' }
    ],
    'topic.html': [
      { text: 'Форум', href: 'forum.html' },
      { text: 'Тема', href: '#' }
    ],
    'guides.html': [
      { text: 'Гайды', href: 'guides.html' }
    ],
    'guide.html': [
      { text: 'Гайды', href: 'guides.html' },
      { text: 'Просмотр гайда', href: '#' }
    ],
    'create-guide.html': [
      { text: 'Гайды', href: 'guides.html' },
      { text: 'Создать гайд', href: 'create-guide.html' }
    ],
    'teams.html': [
      { text: 'Поиск команды', href: 'teams.html' }
    ],
    'create-team.html': [
      { text: 'Поиск команды', href: 'teams.html' },
      { text: 'Создать команду', href: 'create-team.html' }
    ],
    'trade.html': [
      { text: 'Торговля', href: 'trade.html' }
    ],
    'create-trade.html': [
      { text: 'Торговля', href: 'trade.html' },
      { text: 'Создать объявление', href: 'create-trade.html' }
    ],
    'create-topic.html': [
      { text: 'Форум', href: 'forum.html' },
      { text: 'Создать тему', href: 'create-topic.html' }
    ],
    'profile.html': [
      { text: 'Профиль', href: 'profile.html' }
    ],
    'edit-profile.html': [
      { text: 'Профиль', href: 'profile.html' },
      { text: 'Редактировать', href: 'edit-profile.html' }
    ],
    'settings.html': [
      { text: 'Настройки', href: 'settings.html' }
    ],
    'favorites.html': [
      { text: 'Избранное', href: 'favorites.html' }
    ],
    'messages.html': [
      { text: 'Сообщения', href: 'messages.html' }
    ],
    'notifications.html': [
      { text: 'Уведомления', href: 'notifications.html' }
    ],
    'search.html': [
      { text: 'Поиск', href: 'search.html' }
    ],
    'login.html': [
      { text: 'Вход', href: 'login.html' }
    ],
    'register.html': [
      { text: 'Регистрация', href: 'register.html' }
    ]
  };

  const items = breadcrumbsMap[page] || [];
  renderBreadcrumbs(items);
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  const breadcrumbsContainer = document.querySelector('.breadcrumbs__list');
  if (breadcrumbsContainer) {
    initAutoBreadcrumbs();
  }
});

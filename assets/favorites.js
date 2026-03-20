// assets/favorites.js
console.log('✅ favorites.js загружен');

document.addEventListener('DOMContentLoaded', function () {
  if (!ForumDB.isAuthenticated()) {
    notify('Войдите в аккаунт', 'error');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }

  const currentUser = ForumDB.getCurrentUser();
  let currentType = 'topics';
  let favorites = JSON.parse(localStorage.getItem('favorites')) || {};

  // Загрузка избранного
  function loadFavorites() {
    const list = document.getElementById('favoritesList');
    const items = favorites[currentType] || [];

    if (items.length === 0) {
      list.innerHTML = '<div class="no-favorites">Нет избранного</div>';
      return;
    }

    if (currentType === 'topics') {
      list.innerHTML = items.map(item => `
        <div class="favorite-item">
          <a href="topic.html?id=${item.id}" class="favorite-item__title">${item.title}</a>
          <div class="favorite-item__meta">${item.author} • ${item.date}</div>
          <button class="favorite-item__remove" onclick="removeFavorite('topics', ${item.id})">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('');
    } else {
      list.innerHTML = items.map(item => `
        <div class="favorite-item">
          <a href="guide.html?id=${item.id}" class="favorite-item__title">${item.title}</a>
          <div class="favorite-item__meta">${item.author} • ★ ${item.rating}</div>
          <button class="favorite-item__remove" onclick="removeFavorite('guides', ${item.id})">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('');
    }
  }

  // Удаление из избранного
  window.removeFavorite = function (type, id) {
    favorites[type] = (favorites[type] || []).filter(item => item.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
    notify('Удалено из избранного', 'info');
  };

  // Переключение табов
  document.querySelectorAll('.favorites-tabs__btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.favorites-tabs__btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentType = this.dataset.type;
      loadFavorites();
    });
  });

  // Очистить все
  document.getElementById('clearFavorites').addEventListener('click', () => {
    favorites[currentType] = [];
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
    notify('Очищено', 'success');
  });

  // Добавляем тестовые данные
  if (!favorites.topics) {
    favorites.topics = [
      { id: 1, title: 'Обновление 0.37.0', author: 'ProPlayer228', date: '2 дня назад' },
      { id: 2, title: 'Ищем игрока в команду', author: 'TeamLeader', date: '5 дней назад' }
    ];
    favorites.guides = [
      { id: 1, title: 'Гайд по AWP', author: 'SniperMaster', rating: 4.8 }
    ];
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  loadFavorites();
});

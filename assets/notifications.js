// assets/notifications.js
console.log('✅ notifications.js загружен');

document.addEventListener('DOMContentLoaded', function () {
  if (!ForumDB.isAuthenticated()) {
    notify('Войдите в аккаунт', 'error');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }

  const currentUser = ForumDB.getCurrentUser();
  let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

  // Функция загрузки уведомлений
  function loadNotifications() {
    const list = document.getElementById('notificationsList');
    const userNotifications = notifications.filter(n => n.userId === currentUser.id);

    if (userNotifications.length === 0) {
      list.innerHTML = '<div class="no-notifications">Нет уведомлений</div>';
      return;
    }

    list.innerHTML = userNotifications.map(n => `
      <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
        <div class="notification-item__icon">
          <i class="fas ${n.icon || 'fa-bell'}" style="color: ${n.color || '#667eea'}"></i>
        </div>
        <div class="notification-item__content">
          <div class="notification-item__text">${n.text}</div>
          <div class="notification-item__time">${formatTime(n.timestamp)}</div>
        </div>
        <button class="notification-item__mark-read" onclick="markRead(${n.id})">
          <i class="fas fa-circle"></i>
        </button>
      </div>
    `).join('');
  }

  // Форматирование времени
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);

    if (diff < 1) return 'только что';
    if (diff < 60) return `${diff} мин назад`;
    if (diff < 1440) return `${Math.floor(diff / 60)} ч назад`;
    return date.toLocaleDateString();
  }

  // Отметить как прочитанное
  window.markRead = function (id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      localStorage.setItem('notifications', JSON.stringify(notifications));
      loadNotifications();
    }
  };

  // Отметить все как прочитанные
  document.getElementById('markAllRead').addEventListener('click', () => {
    notifications.forEach(n => {
      if (n.userId === currentUser.id) n.read = true;
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    loadNotifications();
    notify('Все уведомления прочитаны', 'success');
  });

  // Добавляем тестовое уведомление при первом запуске
  if (notifications.length === 0) {
    notifications.push({
      id: 1,
      userId: currentUser.id,
      text: 'Добро пожаловать в систему уведомлений!',
      icon: 'fa-bell',
      color: '#667eea',
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  loadNotifications();
});

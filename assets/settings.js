// assets/settings.js
console.log('✅ settings.js загружен');

document.addEventListener('DOMContentLoaded', function () {
  // Проверяем авторизацию
  if (!ForumDB.isAuthenticated()) {
    notify('Необходимо войти в аккаунт', 'error');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }

  const user = ForumDB.getCurrentUser();
  const settings = JSON.parse(localStorage.getItem('userSettings')) || {};

  // Загружаем сохраненные настройки
  document.getElementById('notifyMessages').checked = settings.notifyMessages !== false;
  document.getElementById('notifyReplies').checked = settings.notifyReplies !== false;
  document.getElementById('showEmail').checked = settings.showEmail || false;
  document.getElementById('showGameId').checked = settings.showGameId !== false;

  // Переключение табов
  const tabs = document.querySelectorAll('.settings-tabs__btn');
  const tabContents = document.querySelectorAll('.settings-tab');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      tabs.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${tabName}`).classList.add('active');
    });
  });

  // Смена пароля
  document.getElementById('saveSettings').addEventListener('click', function () {
    const currentPass = document.getElementById('currentPass').value;
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;

    if (newPass && newPass !== confirmPass) {
      notify('Пароли не совпадают', 'error');
      return;
    }

    // Сохраняем настройки уведомлений
    const newSettings = {
      notifyMessages: document.getElementById('notifyMessages').checked,
      notifyReplies: document.getElementById('notifyReplies').checked,
      showEmail: document.getElementById('showEmail').checked,
      showGameId: document.getElementById('showGameId').checked
    };

    localStorage.setItem('userSettings', JSON.stringify(newSettings));

    if (newPass) {
      notify('Пароль и настройки сохранены', 'success');
    } else {
      notify('Настройки сохранены', 'success');
    }
  });
});

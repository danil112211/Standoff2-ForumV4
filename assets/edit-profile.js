// assets/edit-profile.js
console.log('✅ edit-profile.js загружен');

document.addEventListener('DOMContentLoaded', function () {
  // Проверяем авторизацию
  if (!ForumDB.isAuthenticated()) {
    notify('Необходимо войти в аккаунт', 'error');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }

  const user = ForumDB.getCurrentUser();
  const fullUserData = ForumDB.getUser(user.id);

  if (!fullUserData) {
    notify('Ошибка загрузки данных', 'error');
    return;
  }

  // Заполняем форму данными пользователя
  document.getElementById('profileName').value = fullUserData.name || '';
  document.getElementById('profileEmail').value = fullUserData.email || '';
  document.getElementById('profileGameId').value = fullUserData.gameId || '';
  document.getElementById('profileRank').value = fullUserData.gameRank || 'Легенда';
  document.getElementById('profileBio').value = fullUserData.bio || '';

  // Загружаем аватарку если есть
  if (fullUserData.avatar) {
    document.querySelector('.avatar-preview img').src = fullUserData.avatar;
  }

  // Переменная для хранения данных аватарки
  let avatarData = fullUserData.avatar || null;

  // Загрузка аватара
  document.getElementById('uploadAvatar').addEventListener('click', function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = function (e) {
      const file = e.target.files[0];
      if (!file) return;

      // Проверяем размер файла (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        notify('Файл слишком большой. Максимум 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        const img = document.querySelector('.avatar-preview img');
        img.src = event.target.result;
        avatarData = event.target.result; // Сохраняем данные аватарки
        notify('Аватар выбран. Не забудьте сохранить изменения!', 'success');
      };
      reader.onerror = function () {
        notify('Ошибка при чтении файла', 'error');
      };
      reader.readAsDataURL(file);
    };

    input.click();
  });

  // Сохранение профиля
  document.getElementById('editProfileForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('profileName').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const gameId = document.getElementById('profileGameId').value.trim();
    const gameRank = document.getElementById('profileRank').value;
    const bio = document.getElementById('profileBio').value.trim();

    // Валидация
    if (!name) {
      notify('Введите имя пользователя', 'error');
      return;
    }

    if (name.length < 3) {
      notify('Имя должно быть не менее 3 символов', 'error');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify('Введите корректный email', 'error');
      return;
    }

    // Проверка gameId (только цифры)
    if (gameId && !/^\d+$/.test(gameId)) {
      notify('Игровой ID должен содержать только цифры', 'error');
      return;
    }

    const updatedData = {
      name: name,
      email: email,
      gameRank: gameRank,
      bio: bio
    };

    // Добавляем gameId если он указан
    if (gameId) {
      updatedData.gameId = gameId;
    }

    // Добавляем аватарку если она была изменена
    if (avatarData) {
      updatedData.avatar = avatarData;
    }

    console.log('Сохраняем данные:', updatedData);
    console.log('Аватарка:', avatarData ? 'есть' : 'нет');

    if (ForumDB.updateUserProfile(user.id, updatedData)) {
      notify('Профиль сохранён! Перенаправление...', 'success');

      setTimeout(() => {
        window.location.href = 'profile.html?id=' + user.id;
      }, 1500);
    } else {
      notify('Ошибка при сохранении', 'error');
    }
  });

  // Кнопка отмены
  const cancelBtn = document.querySelector('.btn--secondary');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.history.back();
    });
  }
});

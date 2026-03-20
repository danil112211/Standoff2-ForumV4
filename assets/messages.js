// assets/messages.js
console.log('✅ messages.js загружен');

class MessagesPage {
  constructor() {
    this.currentUser = null;
    this.activeDialog = null;
    this.messages = [];
    this.users = [];

    this.init();
  }

  init() {
    // Проверяем авторизацию
    if (!ForumDB.isAuthenticated || !ForumDB.isAuthenticated()) {
      notify('Войдите в аккаунт', 'error');
      setTimeout(() => window.location.href = 'login.html', 1500);
      return;
    }

    this.currentUser = ForumDB.getCurrentUser();
    this.loadData();
    this.renderDialogs();
    this.initEventListeners();
    this.initMobileHandlers();

    // Проверяем, не перешли ли из профиля
    const urlParams = new URLSearchParams(window.location.search);
    const targetUser = urlParams.get('user');
    if (targetUser) {
      setTimeout(() => {
        this.startNewDialog(parseInt(targetUser));
      }, 500);
    }
  }

  loadData() {
    // Получаем все сообщения из базы
    const data = JSON.parse(localStorage.getItem(ForumDB.storageKey));
    this.messages = data?.messages?.filter(msg =>
      msg.senderId === this.currentUser.id || msg.receiverId === this.currentUser.id
    ) || [];

    this.users = data?.users || [];
  }

  saveMessages() {
    const data = JSON.parse(localStorage.getItem(ForumDB.storageKey));
    data.messages = this.messages;
    localStorage.setItem(ForumDB.storageKey, JSON.stringify(data));
  }

  renderDialogs() {
    const dialogsList = document.getElementById('dialogsList');
    if (!dialogsList) return;

    // Группируем сообщения по собеседникам
    const dialogs = {};

    this.messages.forEach(msg => {
      const otherId = msg.senderId === this.currentUser.id ? msg.receiverId : msg.senderId;
      if (!dialogs[otherId]) {
        dialogs[otherId] = {
          userId: otherId,
          messages: [],
          unread: 0
        };
      }
      dialogs[otherId].messages.push(msg);
      if (!msg.read && msg.receiverId === this.currentUser.id) {
        dialogs[otherId].unread++;
      }
    });

    // Преобразуем в массив и сортируем по последнему сообщению
    const dialogsArray = Object.values(dialogs).map(dialog => {
      dialog.lastMessage = dialog.messages.sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
      )[0];
      return dialog;
    }).sort((a, b) =>
      new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    );

    if (dialogsArray.length === 0) {
      dialogsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-envelope-open-text"></i>
          <p>У вас пока нет сообщений</p>
          <button class="btn btn--primary" id="startNewDialog">Написать сообщение</button>
        </div>
      `;

      document.getElementById('startNewDialog')?.addEventListener('click', () => {
        this.startNewDialog();
      });

      return;
    }

    dialogsList.innerHTML = dialogsArray.map(dialog => {
      const user = this.users.find(u => u.id === dialog.userId) || {
        name: 'Пользователь',
        avatar: 'assets/avatars/default.jpg'
      };

      const time = this.formatTime(dialog.lastMessage.timestamp);

      return `
        <div class="dialog ${dialog.userId === this.activeDialog ? 'active' : ''}" data-user="${dialog.userId}">
          <div class="dialog__avatar">
            <img src="${user.avatar || 'assets/avatars/default.jpg'}" alt="${user.name}">
          </div>
          <div class="dialog__info">
            <div class="dialog__header">
              <span class="dialog__name">${user.name}</span>
              <span class="dialog__time">${time}</span>
            </div>
            <div class="dialog__last-message">${dialog.lastMessage.text || ''}</div>
          </div>
          ${dialog.unread ? `<span class="dialog__badge">${dialog.unread}</span>` : ''}
        </div>
      `;
    }).join('');

    // Добавляем обработчики
    document.querySelectorAll('.dialog').forEach(dialog => {
      dialog.addEventListener('click', () => {
        this.activeDialog = parseInt(dialog.dataset.user);
        document.querySelectorAll('.dialog').forEach(d => d.classList.remove('active'));
        dialog.classList.add('active');
        this.loadMessages(this.activeDialog);
      });
    });

    // Если есть активный диалог, показываем его сообщения
    if (this.activeDialog) {
      this.loadMessages(this.activeDialog);
    }
  }

  loadMessages(userId) {
    const chatMessages = document.getElementById('chatMessages');
    const chatHeader = document.getElementById('chatHeader');
    if (!chatMessages || !chatHeader) return;

    const user = this.users.find(u => u.id === userId) || {
      name: 'Пользователь',
      avatar: 'assets/avatars/default.jpg'
    };

    // Обновляем шапку чата
    chatHeader.innerHTML = `
      <div class="chat__user">
        <div class="chat__avatar">
          <img src="${user.avatar || 'assets/avatars/default.jpg'}" alt="${user.name}">
        </div>
        <div class="chat__info">
          <span class="chat__name">${user.name}</span>
          <span class="chat__status">онлайн</span>
        </div>
      </div>
    `;

    // Фильтруем сообщения с этим пользователем
    const userMessages = this.messages.filter(msg =>
      (msg.senderId === this.currentUser.id && msg.receiverId === userId) ||
      (msg.senderId === userId && msg.receiverId === this.currentUser.id)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (userMessages.length === 0) {
      chatMessages.innerHTML = `
        <div class="empty-state">
          <p>Начните диалог первым</p>
        </div>
      `;
      return;
    }

    chatMessages.innerHTML = userMessages.map(msg => {
      const isSent = msg.senderId === this.currentUser.id;
      const time = this.formatTime(msg.timestamp, true);

      return `
        <div class="message ${isSent ? 'message--sent' : 'message--received'}">
          <div class="message__content">${msg.text}</div>
          <div class="message__time">${time}</div>
        </div>
      `;
    }).join('');

    // Помечаем сообщения как прочитанные
    let hasUnread = false;
    userMessages.forEach(msg => {
      if (msg.receiverId === this.currentUser.id && !msg.read) {
        msg.read = true;
        hasUnread = true;
      }
    });

    if (hasUnread) {
      this.saveMessages();
      this.renderDialogs(); // Обновляем список диалогов (счетчики)
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  sendMessage() {
    if (!this.activeDialog) {
      notify('Выберите диалог', 'warning');
      return;
    }

    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    // Создаем новое сообщение
    const newMsg = {
      id: Date.now(),
      senderId: this.currentUser.id,
      receiverId: this.activeDialog,
      text: text,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.messages.push(newMsg);
    this.saveMessages();

    input.value = '';
    this.loadMessages(this.activeDialog);
    this.renderDialogs();
  }

  startNewDialog(targetUserId = null) {
    // Если передан ID пользователя (из профиля)
    if (targetUserId) {
      this.activeDialog = targetUserId;
      this.renderDialogs();
      this.loadMessages(targetUserId);

      // Фокусируемся на вводе сообщения
      setTimeout(() => {
        document.getElementById('messageInput')?.focus();
      }, 300);
      return;
    }

    // Создаем модальное окно с поиском по ID
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
    <div class="modal__content">
      <h3>Новое сообщение</h3>

      <div class="search-by-id">
        <label for="userIdSearch">Введите ID пользователя:</label>
        <div class="search-input-group">
          <input type="text" id="userIdSearch" class="form__input" placeholder="Системный ID или игровой ID">
          <button class="btn btn--primary" id="searchUserBtn">Найти</button>
        </div>
      </div>

      <div id="searchResult" style="display: none; margin: 15px 0;"></div>

      <div id="messageComposer" style="display: none;">
        <textarea id="newMessageText" class="form__input" placeholder="Текст сообщения..." rows="4"></textarea>
        <div class="modal__actions">
          <button class="btn btn--primary" id="sendNewMessage">Отправить</button>
          <button class="btn btn--secondary" id="closeModalBtn">Отмена</button>
        </div>
      </div>

      <div class="modal__actions" id="initialActions">
        <button class="btn btn--secondary modal__actions-btn" id="closeModalBtn">Отмена</button>
      </div>
    </div>
  `;

    document.body.appendChild(modal);

    // Поиск пользователя по ID
    const searchBtn = document.getElementById('searchUserBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const searchValue = document.getElementById('userIdSearch').value.trim();

        if (!searchValue) {
          notify('Введите ID пользователя', 'error');
          return;
        }

        // Проверяем, число ли это
        const isNumber = /^\d+$/.test(searchValue);
        const numericId = isNumber ? parseInt(searchValue) : null;

        console.log('🔍 Ищем:', searchValue, 'как число:', numericId);

        // Ищем пользователя в базе
        const user = this.users.find(u =>
          // По системному ID (число)
          (isNumber && u.id === numericId) ||
          // По игровому ID (строка)
          (u.gameId && u.gameId.toString() === searchValue)
        );

        console.log('👤 Найден пользователь:', user);

        const searchResult = document.getElementById('searchResult');
        const messageComposer = document.getElementById('messageComposer');
        const initialActions = document.getElementById('initialActions');

        if (!searchResult || !messageComposer || !initialActions) return;

        if (!user) {
          // Пользователь не найден
          searchResult.style.display = 'block';
          searchResult.innerHTML = `
          <div class="error-message" style="color: #ff4757; padding: 10px; background: rgba(255,71,87,0.1); border-radius: 8px;">
            <i class="fas fa-exclamation-circle"></i>
            Пользователь с ID ${searchValue} не найден
          </div>
        `;
          messageComposer.style.display = 'none';
          return;
        }

        if (user.id === this.currentUser.id) {
          searchResult.style.display = 'block';
          searchResult.innerHTML = `
          <div class="error-message" style="color: #ffa502; padding: 10px; background: rgba(255,165,2,0.1); border-radius: 8px;">
            <i class="fas fa-exclamation-triangle"></i>
            Нельзя отправить сообщение самому себе
          </div>
        `;
          messageComposer.style.display = 'none';
          return;
        }

        // Пользователь найден
        searchResult.style.display = 'block';
        searchResult.innerHTML = `
        <div class="user-found" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(102,126,234,0.1); border-radius: 8px;">
          <img src="${user.avatar || 'assets/avatars/default.jpg'}"
               alt="${user.name}"
               style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-primary-start);">
          <div>
            <div style="font-weight: 600; color: var(--color-text-white);">${user.name}</div>
            <div style="color: var(--color-text-muted); font-size: 0.9rem;">Системный ID: ${user.id}</div>
            ${user.gameId ? `<div style="color: var(--color-text-muted); font-size: 0.9rem;">Игровой ID: ${user.gameId}</div>` : ''}
          </div>
        </div>
      `;

        // Показываем поле ввода сообщения
        messageComposer.style.display = 'block';
        initialActions.style.display = 'none';
        messageComposer.dataset.userId = user.id;
      });
    }

    // Отправка сообщения
    const sendBtn = document.getElementById('sendNewMessage');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        const messageComposer = document.getElementById('messageComposer');
        const userId = parseInt(messageComposer?.dataset.userId);
        const text = document.getElementById('newMessageText')?.value.trim();

        if (!userId) {
          notify('Сначала найдите пользователя', 'error');
          return;
        }

        if (!text) {
          notify('Введите текст сообщения', 'error');
          return;
        }

        // Создаем сообщение
        const newMsg = {
          id: Date.now(),
          senderId: this.currentUser.id,
          receiverId: userId,
          text: text,
          timestamp: new Date().toISOString(),
          read: false
        };

        this.messages.push(newMsg);
        this.saveMessages();

        modal.remove();
        this.activeDialog = userId;
        this.renderDialogs();
        this.loadMessages(userId);

        notify('Сообщение отправлено', 'success');
      });
    }

    // Закрытие модалки
    document.querySelectorAll('#closeModalBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.remove();
      });
    });
  }

  initEventListeners() {
    console.log('🔄 Инициализация обработчиков (делегирование)...');

    // Вешаем обработчик на документ
    document.addEventListener('click', (e) => {
      // Плюсик
      const target = e.target.closest('#newMessageBtn');
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        console.log('✅ Клик по плюсику');
        this.startNewDialog();
      }

      // Кнопка "Написать сообщение" в пустом состоянии
      const startBtn = e.target.closest('#startNewDialog');
      if (startBtn) {
        e.preventDefault();
        console.log('✅ Клик по кнопке "Написать сообщение"');
        this.startNewDialog();
      }
    });

    // Кнопка отправки
    document.addEventListener('click', (e) => {
      if (e.target.closest('#sendMessageBtn')) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Enter
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
  }

  initMobileHandlers() {
    // Для мобильной версии
    const sidebar = document.querySelector('.messages__sidebar');
    const chat = document.querySelector('.messages__chat');

    if (!sidebar || !chat) return;

    // Кнопка "Назад" на мобилках
    const backBtn = document.createElement('button');
    backBtn.className = 'mobile-back-btn';
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> К диалогам';
    backBtn.style.display = 'none';
    backBtn.style.margin = '10px';
    backBtn.style.padding = '8px 12px';
    backBtn.style.background = 'var(--color-bg-card)';
    backBtn.style.border = '1px solid var(--color-border-light)';
    backBtn.style.borderRadius = '8px';
    backBtn.style.color = 'var(--color-text-white)';
    backBtn.style.cursor = 'pointer';

    chat.prepend(backBtn);

    backBtn.addEventListener('click', () => {
      sidebar.classList.remove('active');
      backBtn.style.display = 'none';
    });

    // При клике на диалог на мобилке
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && e.target.closest('.dialog')) {
        sidebar.classList.add('active');
        backBtn.style.display = 'flex';
      }
    });
  }

  formatTime(timestamp, full = false) {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60)); // минуты

    if (full) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }

    if (diff < 1) return 'только что';
    if (diff < 60) return `${diff} мин назад`;
    if (diff < 1440) {
      const hours = Math.floor(diff / 60);
      return `${hours} ч назад`;
    }
    if (diff < 2880) return 'вчера';

    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }


}

// Запускаем
document.addEventListener('DOMContentLoaded', () => {
  window.messagesPage = new MessagesPage();
});

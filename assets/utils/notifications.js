/**
 * УЛУЧШЕННАЯ СИСТЕМА УВЕДОМЛЕНИЙ
 * С учетом шапки и защитой от спама
 */

const NotificationSystem = {
  icons: {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle'
  },

  // Контейнер для всех уведомлений
  container: null,

  // Максимальное количество уведомлений
  maxNotifications: 3,

  // Защита от спама
  lastShowTime: 0,
  minInterval: 500,

  // Высота шапки
  headerHeight: 0,

  // Создаем контейнер при первом вызове
  ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'notifications-container';
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);

      // Добавляем стили
      const style = document.createElement('style');
      style.textContent = `
        .notifications-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 400px;
          pointer-events: none;
          transition: top 0.3s ease;
        }

        /* Учитываем высоту шапки */
        .notifications-container.with-header {
          top: 100px; /* Значение будет обновляться через JS */
        }

        .notification {
          pointer-events: auto;
          background: rgba(15, 15, 26, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid var(--color-border-light);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          transform: translateX(150%);
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: var(--shadow-card);
          position: relative;
          max-width: 100%;
          word-break: break-word;
        }

        .notification.show {
          transform: translateX(0);
        }

        /* Старые уведомления */
        .notification.old {
          opacity: 0.5;
          filter: grayscale(0.3);
        }

        /* Новое уведомление */
        .notification:not(.old) {
          opacity: 1;
          filter: none;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        /* Типы уведомлений */
        .notification--success { border-left: 4px solid #2ed573; }
        .notification--error { border-left: 4px solid #ff4757; }
        .notification--info { border-left: 4px solid #667eea; }
        .notification--warning { border-left: 4px solid #ffa502; }

        .notification--success .notification__icon { color: #2ed573; }
        .notification--error .notification__icon { color: #ff4757; }
        .notification--info .notification__icon { color: #667eea; }
        .notification--warning .notification__icon { color: #ffa502; }

        .notification__icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .notification__content {
          flex: 1;
          min-width: 0;
        }

        .notification__title {
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .notification__text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .notification__close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          padding: 4px;
          font-size: 0.9rem;
          transition: color 0.2s ease;
          flex-shrink: 0;
        }

        .notification__close:hover {
          color: white;
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .notifications-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }

          .notifications-container.with-header {
            top: 70px;
          }

          .notification {
            padding: 10px 14px;
          }

          .notification__title {
            font-size: 0.85rem;
          }

          .notification__text {
            font-size: 0.8rem;
          }
        }

        /* Очень маленькие экраны */
        @media (max-width: 480px) {
          .notification {
            padding: 8px 12px;
          }

          .notification__icon {
            font-size: 1rem;
          }

          .notification__close {
            padding: 2px;
          }
        }
      `;
      document.head.appendChild(style);

      // Запускаем отслеживание шапки
      this.initHeaderTracking();
    }
  },

  // Инициализация отслеживания шапки
  initHeaderTracking() {
    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.checkHeader());
    } else {
      this.checkHeader();
    }

    // Отслеживаем скролл
    window.addEventListener('scroll', () => this.checkHeader(), { passive: true });

    // Отслеживаем изменение размера окна
    window.addEventListener('resize', () => this.checkHeader());

    // Отслеживаем динамические изменения (например, появление шапки после скролла)
    const observer = new MutationObserver(() => this.checkHeader());
    observer.observe(document.body, { childList: true, subtree: true });
  },

  // Проверяем, видна ли шапка
  checkHeader() {
    const header = document.querySelector('.navbar, .header, header[class*="header"]');

    if (!header) return;

    this.headerHeight = header.offsetHeight;
    const headerRect = header.getBoundingClientRect();
    const headerStyle = window.getComputedStyle(header);

    // Проверяем тип шапки
    const isStickyOrFixed = headerStyle.position === 'sticky' ||
      headerStyle.position === 'fixed';

    // Получаем текущую позицию скролла
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (this.container) {
      // Определяем, видна ли шапка полностью
      const isHeaderFullyVisible = headerRect.top >= 0 &&
        headerRect.bottom <= window.innerHeight;

      // Определяем, находимся ли мы в самом верху (с небольшим допуском)
      const isAtTop = scrollTop < 10;

      if (isAtTop || isHeaderFullyVisible) {
        // В самом верху или шапка полностью видна - уведомления под шапкой
        const headerOffset = headerRect.bottom + 10;
        this.container.style.top = headerOffset + 'px';
        this.container.classList.add('with-header');
        console.log('📌 Уведомления под шапкой на', headerOffset);
      }
      else if (isStickyOrFixed) {
        // Для sticky/fixed шапки
        const headerOffset = headerRect.bottom + 10;
        this.container.style.top = headerOffset + 'px';
        this.container.classList.add('with-header');
      }
      else {
        // Шапка скрыта - уведомления сверху
        this.container.style.top = '20px';
        this.container.classList.remove('with-header');
      }
    }
  },

  // Добавь принудительное обновление при скролле
  initScrollTracking() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.checkHeader();
          ticking = false;
        });
        ticking = true;
      }
    });
  },
  // Показать уведомление с защитой от спама
  show(message, type = 'info', duration = 5000) {
    // Защита от спама
    const now = Date.now();
    if (now - this.lastShowTime < this.minInterval) {
      console.log('⚠️ Слишком частые уведомления, пропускаем');
      return null;
    }
    this.lastShowTime = now;

    this.ensureContainer();

    const id = Date.now() + Math.random();

    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.dataset.id = id;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');

    notification.innerHTML = `
      <i class="${this.icons[type]} notification__icon" aria-hidden="true"></i>
      <div class="notification__content">
        <div class="notification__title">${type === 'success' ? 'Успех' :
        type === 'error' ? 'Ошибка' :
          type === 'warning' ? 'Предупреждение' : 'Информация'}</div>
        <div class="notification__text">${message}</div>
      </div>
      <button class="notification__close" aria-label="Закрыть">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Добавляем в КОНЕЦ контейнера
    this.container.appendChild(notification);

    // Проверяем лимит и удаляем лишние
    this.enforceLimit();

    // Анимация появления
    setTimeout(() => notification.classList.add('show'), 10);

    // Обработчик закрытия
    notification.querySelector('.notification__close').addEventListener('click', (e) => {
      e.stopPropagation();
      this.close(id);
    });

    // Автоматическое закрытие
    if (duration > 0) {
      setTimeout(() => this.close(id), duration);
    }

    // Обновляем статусы старых/новых
    this.updateAges();

    return id;
  },

  // Закрыть уведомление
  close(id) {
    const notification = document.querySelector(`.notification[data-id="${id}"]`);
    if (!notification) return;

    // Анимация исчезновения
    notification.classList.remove('show');

    // Удаляем из DOM
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
      // Обновляем статусы после удаления
      this.updateAges();
    }, 300);
  },

  // Проверить и применить лимит
  enforceLimit() {
    const notifications = this.container.children;

    // Если уведомлений больше максимума
    if (notifications.length > this.maxNotifications) {
      // Удаляем самые старые (первые) с задержкой для плавности
      const toRemove = notifications.length - this.maxNotifications;
      for (let i = 0; i < toRemove; i++) {
        const oldest = notifications[0];
        if (oldest) {
          oldest.classList.remove('show');
          setTimeout(() => {
            if (oldest.parentNode) {
              oldest.remove();
            }
          }, 300);
        }
      }
    }
  },

  // Обновить статусы (старое/новое)
  updateAges() {
    const notifications = this.container.children;

    // Убираем класс old у всех
    for (let i = 0; i < notifications.length; i++) {
      notifications[i].classList.remove('old');
    }

    // Добавляем класс old всем, кроме последнего
    for (let i = 0; i < notifications.length - 1; i++) {
      notifications[i].classList.add('old');
    }
  },

  // Очистить все уведомления
  clearAll() {
    this.container.innerHTML = '';
  },

  // Изменить максимальное количество уведомлений
  setMaxNotifications(count) {
    this.maxNotifications = count;
    this.enforceLimit();
  }
};

// Упрощенный вызов
const notify = (message, type = 'info', duration = 5000) => {
  return NotificationSystem.show(message, type, duration);
};

// Добавляем в глобальную область
window.notify = notify;
window.notifications = NotificationSystem;

/**
 * УНИВЕРСАЛЬНЫЙ ВАЛИДАТОР ФОРМ
 * =============================
 *
 * Что делает: проверяет формы, показывает ошибки, отправляет данные
 *
 * Как использовать:
 * new FormValidator('loginForm', {
 *   onSubmit: (data) => { ... },        // что делать при отправке
 *   showNotifications: true,             // показывать уведомления?
 *   loadingClass: 'btn--loading'         // класс для кнопки загрузки
 * });
 */

class FormValidator {
  /**
   * Создает валидатор для формы
   * @param {string} formId - ID формы (например, 'loginForm')
   * @param {Object} options - настройки
   */
  constructor(formId, options = {}) {
    // 1️⃣ Находим форму по ID
    this.form = document.getElementById(formId);
    if (!this.form) {
      console.warn(`Форма с id "${formId}" не найдена`);
      return;
    }

    // 2️⃣ Настройки по умолчанию + пользовательские
    this.options = {
      onSubmit: null,                    // функция при отправке
      showNotifications: true,             // показывать уведомления
      loadingClass: 'btn--loading',        // класс для кнопки загрузки
      errorContainerId: 'form-error',      // ID для ошибок
      successContainerId: 'form-success',  // ID для успеха
      ...options
    };

    // 3️⃣ Запускаем инициализацию
    this.init();
  }

  /**
   * Инициализация: добавляем обработчики событий
   */
  init() {
    // Отправка формы
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    // Ввод в поля (проверка в реальном времени)
    this.form.addEventListener('input', this.handleInput.bind(this));

    // Потеря фокуса (проверка при уходе с поля)
    this.form.querySelectorAll('[required]').forEach(input => {
      input.addEventListener('blur', this.validateField.bind(this, input));
    });

    console.log(`✓ Валидатор для формы "${this.form.id}" запущен`);
  }

  /**
   * Обработчик отправки формы
   */
  handleSubmit(e) {
    e.preventDefault(); // Не даем форме отправиться по-старому

    // Сначала проверяем все поля
    if (!this.validateForm()) {
      this.showFormError('Пожалуйста, заполните все поля правильно');
      return;
    }

    // Показываем загрузку на кнопке
    this.setLoading(true);

    // Если есть кастомный обработчик - вызываем его
    if (this.options.onSubmit) {
      // Передаем данные формы
      this.options.onSubmit(this.getFormData());
    } else {
      // Если обработчика нет - имитируем отправку
      setTimeout(() => {
        this.setLoading(false);
        this.showFormSuccess('Форма успешно отправлена!');
      }, 1500);
    }
  }

  /**
   * Обработчик ввода в поле
   */
  handleInput(e) {
    const input = e.target;
    // Проверяем только обязательные поля
    if (input.hasAttribute('required')) {
      this.validateField(input);
    }
  }

  /**
   * Проверка одного поля
   * @param {HTMLElement} input - поле для проверки
   * @returns {boolean} - true если поле валидно
   */
  validateField(input) {
    // Ищем элемент для ошибки (должен иметь id = input.id + '-error')
    const errorElement = document.getElementById(`${input.id}-error`);
    let isValid = true;
    let errorMessage = '';

    // 1️⃣ Проверка на пустое поле
    if (!input.value.trim()) {
      isValid = false;
      errorMessage = 'Это поле обязательно для заполнения';
    }
    // 2️⃣ Проверка email
    else if (input.type === 'email' || input.name === 'email') {
      if (!this.isValidEmail(input.value)) {
        isValid = false;
        errorMessage = 'Введите корректный email адрес (например: name@mail.ru)';
      }
    }
    // 3️⃣ Проверка пароля
    else if (input.type === 'password' || input.name === 'password') {
      if (!this.isValidPassword(input.value)) {
        isValid = false;
        errorMessage = 'Пароль должен содержать не менее 8 символов';
      }
    }

    // Обновляем классы и текст ошибки
    this.updateFieldState(input, errorElement, isValid, errorMessage);

    return isValid;
  }

  /**
   * Обновляет состояние поля (классы и ошибку)
   */
  updateFieldState(input, errorElement, isValid, errorMessage) {
    if (isValid) {
      // Поле валидно - убираем ошибку, добавляем валидный класс
      input.classList.remove('form__input--error');
      input.classList.add('form__input--valid');
      if (errorElement) errorElement.textContent = '';
    } else {
      // Поле невалидно - добавляем ошибку
      input.classList.add('form__input--error');
      input.classList.remove('form__input--valid');
      if (errorElement) errorElement.textContent = errorMessage;
    }
  }

  /**
   * Проверяет всю форму целиком
   * @returns {boolean} - true если вся форма валидна
   */
  validateForm() {
    let isValid = true;

    // Проверяем все обязательные поля
    this.form.querySelectorAll('[required]').forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Проверка email
   */
  isValidEmail(email) {
    // Регулярное выражение для email: что-то@что-то.что-то
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Проверка пароля (минимум 8 символов)
   */
  isValidPassword(password) {
    return password.length >= 8;
  }

  /**
   * Показывает сообщение об ошибке в форме
   */
  showFormError(message) {
    // Находим контейнеры для сообщений
    const errorElement = document.getElementById(this.options.errorContainerId);
    const successElement = document.getElementById(this.options.successContainerId);

    // Очищаем успех
    if (successElement) {
      successElement.textContent = '';
      successElement.classList.remove('show');
    }

    // Показываем ошибку
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');

      // Прокручиваем к сообщению
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Если включены уведомления - показываем и их
    if (this.options.showNotifications && window.notify) {
      notify(message, 'error');
    }
  }

  /**
   * Показывает сообщение об успехе
   */
  showFormSuccess(message) {
    const errorElement = document.getElementById(this.options.errorContainerId);
    const successElement = document.getElementById(this.options.successContainerId);

    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }

    if (successElement) {
      successElement.textContent = message;
      successElement.classList.add('show');
      successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (this.options.showNotifications && window.notify) {
      notify(message, 'success');
    }
  }

  /**
   * Управление состоянием загрузки на кнопке
   */
  setLoading(isLoading) {
    const submitBtn = this.form.querySelector('.btn--submit');
    if (!submitBtn) return;

    if (isLoading) {
      submitBtn.classList.add(this.options.loadingClass);
      submitBtn.disabled = true;
    } else {
      submitBtn.classList.remove(this.options.loadingClass);
      submitBtn.disabled = false;
    }
  }

  /**
   * Собирает данные формы в объект
   * @returns {Object} - данные формы { поле1: значение1, поле2: значение2 }
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    // Преобразуем FormData в обычный объект
    formData.forEach((value, key) => {
      // Поддержка checkbox
      if (data[key]) {
        // Если уже есть такое поле - делаем массив
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    return data;
  }

  /**
   * Очищает все сообщения формы
   */
  clearMessages() {
    const errorDiv = document.getElementById(this.options.errorContainerId);
    const successDiv = document.getElementById(this.options.successContainerId);

    if (errorDiv) {
      errorDiv.textContent = '';
      errorDiv.classList.remove('show');
    }

    if (successDiv) {
      successDiv.textContent = '';
      successDiv.classList.remove('show');
    }
  }

  /**
   * Сбрасывает форму и очищает сообщения
   */
  reset() {
    this.form.reset();
    this.clearMessages();

    // Убираем классы валидации со всех полей
    this.form.querySelectorAll('.form__input--error, .form__input--valid').forEach(input => {
      input.classList.remove('form__input--error', 'form__input--valid');
    });
  }
}

// ===== УДОБНЫЕ ФУНКЦИИ ДЛЯ БЫСТРОГО СОЗДАНИЯ =====

/**
 * Быстрое создание валидатора для формы входа
 */
function createLoginValidator(onSubmit) {
  return new FormValidator('loginForm', {
    onSubmit: onSubmit || ((data) => {
      console.log('Вход:', data);
      notify('Вход выполнен!', 'success');
    }),
    errorContainerId: 'form-error',
    successContainerId: 'form-success'
  });
}

/**
 * Быстрое создание валидатора для формы регистрации
 */
function createRegisterValidator(onSubmit) {
  return new FormValidator('registerForm', {
    onSubmit: onSubmit || ((data) => {
      console.log('Регистрация:', data);
      notify('Регистрация успешна!', 'success');
    }),
    errorContainerId: 'form-error',
    successContainerId: 'form-success'
  });
}

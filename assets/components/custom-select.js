/**
 * КАСТОМНЫЙ SELECT
 */

if (typeof window.CustomSelect !== 'undefined') {
  console.warn('⚠️ CustomSelect уже загружен');
} else {
  console.log('✅ CustomSelect загружен');
}

class CustomSelect {
  constructor(selectElement) {
    // ❗ КРИТИЧЕСКИ ВАЖНО: сохраняем select элемент
    if (!selectElement) {
      console.error('❌ Select element not found');
      return;
    }

    this.select = selectElement;  // ← ЭТО БЫЛО ПРОПУЩЕНО!
    this.options = Array.from(this.select.options);
    this.selectedValue = this.select.value;
    this.selectedText = this.select.options[this.select.selectedIndex]?.text || 'Выберите...';

    this.isOpen = false;
    this.isClosing = false;
    this.wrapper = null;
    this.selected = null;
    this.optionsList = null;
    this.outsideClickHandler = null;

    this.init();
  }

  init() {
    // Прячем оригинальный select
    this.select.style.display = 'none';
    this.select.setAttribute('hidden', 'true');

    // Создаем кастомный select
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'custom-select';

    // Выбранный элемент
    this.selected = document.createElement('div');
    this.selected.className = 'custom-select__selected';
    this.selected.innerHTML = `
      <span>${this.selectedText}</span>
      <i class="fas fa-chevron-down"></i>
    `;

    this.wrapper.appendChild(this.selected);
    this.select.parentNode.insertBefore(this.wrapper, this.select.nextSibling);

    this.selected.addEventListener('click', (e) => this.toggleDropdown(e));

    // Сохраняем в глобальном массиве
    if (!window.customSelects) {
      window.customSelects = [];
    }
    window.customSelects.push(this);
  }

  toggleDropdown(e) {
    e.stopPropagation();

    // Если список закрывается - игнорируем клики
    if (this.isClosing) return;

    // Закрываем другие
    if (window.customSelects) {
      window.customSelects.forEach(select => {
        if (select !== this && select.isOpen) {
          select.closeDropdown();
        }
      });
    }

    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.optionsList = document.createElement('ul');
    this.optionsList.className = 'custom-select__options';

    this.options.forEach(option => {
      const li = document.createElement('li');
      li.className = 'custom-select__option';
      if (option.value === this.selectedValue) {
        li.classList.add('selected');
      }
      li.textContent = option.text;
      li.dataset.value = option.value;

      // Добавляем защиту от кликов при закрытии
      li.addEventListener('mousedown', (e) => {
        if (this.isClosing) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      });

      li.addEventListener('click', (e) => {
        e.stopPropagation();

        // Защита от кликов при закрытии
        if (this.isClosing) return;

        this.selectOption(option.value, option.text);
      });

      this.optionsList.appendChild(li);
    });

    this.wrapper.appendChild(this.optionsList);

    // Небольшая задержка для анимации
    setTimeout(() => {
      if (this.optionsList) {
        this.optionsList.classList.add('show');
      }
    }, 10);

    this.isOpen = true;
    this.selected.classList.add('active');

    // Обработчик для закрытия при клике вне
    setTimeout(() => {
      document.addEventListener('click', this.outsideClickHandler = (e) => {
        if (!this.wrapper.contains(e.target) && this.isOpen) {
          this.closeDropdown();
        }
      });
    }, 0);
  }

  closeDropdown() {
    if (!this.isOpen) return;

    // Ставим флаг закрытия
    this.isClosing = true;

    if (this.outsideClickHandler) {
      document.removeEventListener('click', this.outsideClickHandler);
    }

    if (this.optionsList) {
      this.optionsList.classList.remove('show');

      // Удаляем из DOM после анимации
      setTimeout(() => {
        if (this.optionsList && this.optionsList.parentNode) {
          this.optionsList.parentNode.removeChild(this.optionsList);
          this.optionsList = null;
        }
        // Снимаем флаг закрытия
        this.isClosing = false;
      }, 200); // Время анимации
    }

    this.isOpen = false;
    this.selected.classList.remove('active');
  }

  selectOption(value, text) {
    // Защита от выбора при закрытии
    if (this.isClosing) return;

    this.selectedValue = value;
    this.selectedText = text;

    const span = this.selected.querySelector('span');
    if (span) span.textContent = text;

    this.select.value = value;
    this.select.dispatchEvent(new Event('change', { bubbles: true }));
    this.closeDropdown();
  }
}

// Делаем глобальным
window.CustomSelect = CustomSelect;
console.log('✅ CustomSelect загружен');

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
  const selects = document.querySelectorAll('select.custom');
  console.log('🔍 Найдено select.custom:', selects.length);

  selects.forEach(select => {
    console.log('📦 Создаем кастомный select для:', select);
    new CustomSelect(select);
  });
});

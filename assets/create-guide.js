// assets/create-guide.js
console.log('✅ create-guide.js загружен');

// ===== ФОРМАТИРОВАНИЕ ТЕКСТА =====
window.formatText = function (cmd, value = null) {
  console.log('formatText called:', cmd, value);
  document.execCommand(cmd, false, value);
  document.getElementById('editor').focus();
};

// ===== УМНЫЕ ЗАГОЛОВКИ =====
window.insertHeading = function (level) {
  console.log('insertHeading called:', level);

  const editor = document.getElementById('editor');
  const selection = window.getSelection();
  const selectedText = selection.toString();
  const lines = selectedText.split('\n').filter(line => line.trim());

  if (lines.length > 1) {
    if (window.notify) notify('Заголовок можно применить только к одной строке', 'warning');
    return;
  }

  // Проверяем, не внутри ли мы уже такого же заголовка
  let node = selection.focusNode;
  let currentHeading = null;
  let currentLevel = null;

  while (node && node !== editor) {
    const tagName = node.nodeName?.toLowerCase();
    if (tagName && tagName.match(/^h[1-6]$/)) {
      currentHeading = node;
      currentLevel = parseInt(tagName[1]);
      break;
    }
    node = node.parentNode;
  }

  if (currentHeading && currentLevel === level) {
    // Если это тот же заголовок - сбрасываем в обычный текст
    console.log('Сбрасываем заголовок в обычный текст');
    document.execCommand('formatBlock', false, 'p');
  } else {
    // Если другой заголовок или не заголовок - применяем новый
    console.log('Применяем заголовок h' + level);
    document.execCommand('formatBlock', false, `h${level}`);
  }

  editor.focus();
};

// ===== УМНЫЕ СПИСКИ (исправленная версия) =====
window.insertList = function (type) {
  console.log('insertList called:', type);

  const editor = document.getElementById('editor');
  const selection = window.getSelection();

  if (!selection.rangeCount) return;

  // Просто применяем список без лишних манипуляций
  document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false, null);

  editor.focus();
};

// ===== УМНАЯ ЦИТАТА =====
window.insertQuote = function () {
  console.log('insertQuote called');

  const editor = document.getElementById('editor');
  const selection = window.getSelection();

  if (!selection.toString()) {
    if (window.notify) notify('Выделите текст для цитирования', 'warning');
    return;
  }

  // Проверяем, не внутри ли мы уже цитаты
  let node = selection.focusNode;
  let quoteElement = null;

  while (node && node !== editor) {
    if (node.nodeName === 'BLOCKQUOTE') {
      quoteElement = node;
      break;
    }
    node = node.parentNode;
  }

  if (quoteElement) {
    console.log('Убираем цитату');
    document.execCommand('formatBlock', false, 'p');
  } else {
    console.log('Добавляем цитату');
    document.execCommand('formatBlock', false, 'blockquote');
  }

  editor.focus();
};

// ===== ОБЫЧНЫЙ ТЕКСТ (С ЗАЩИТОЙ ВСЕГО СПИСКА) =====
window.formatParagraph = function () {
  console.log('formatParagraph called');

  const editor = document.getElementById('editor');
  const selection = window.getSelection();

  // Проверяем, не в списке ли мы (включая весь список)
  let node = selection.focusNode;
  let inList = false;
  let listElement = null;

  while (node && node !== editor) {
    if (node.nodeName === 'LI') {
      inList = true;
      listElement = node.parentNode; // Нашли родительский список
      break;
    }
    if (node.nodeName === 'UL' || node.nodeName === 'OL') {
      inList = true;
      listElement = node;
      break;
    }
    node = node.parentNode;
  }

  if (inList) {
    console.log('В списке - ничего не делаем');
    editor.focus();
    return; // ⬅️ ВАЖНО: ВЫХОДИМ, НИЧЕГО НЕ МЕНЯЕМ
  }

  // Если не в списке - убираем форматирование
  if (!selection.toString()) {
    document.execCommand('formatBlock', false, 'p');
  } else {
    document.execCommand('removeFormat', false, null);
    document.execCommand('formatBlock', false, 'p');
  }

  editor.focus();
};
// ===== ССЫЛКА (с выбором текста) =====
window.insertLink = function () {
  const selection = window.getSelection();
  const selectedText = selection.toString();

  let url = prompt('Введите ссылку:', 'https://');
  if (!url) return;

  // Добавляем https:// если нет протокола
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  if (selectedText) {
    // Если есть выделенный текст - делаем его ссылкой
    document.execCommand('createLink', false, url);
  } else {
    // Если нет выделения - вставляем ссылку как текст
    const link = document.createElement('a');
    link.href = url;
    link.textContent = url;
    link.style.color = 'var(--color-primary-start)';
    link.style.textDecoration = 'underline';

    const editor = document.getElementById('editor');
    const range = selection.getRangeAt(0);
    range.insertNode(link);
  }

  document.getElementById('editor').focus();
};

// ===== ИЗОБРАЖЕНИЕ/ВИДЕО (с миниатюрой и крестиком) =====
window.insertImage = function () {
  // Создаем input для выбора файла
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,video/*';

  input.onchange = function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const url = event.target.result;

      // Создаем контейнер для медиа
      const mediaContainer = document.createElement('div');
      mediaContainer.style.position = 'relative';
      mediaContainer.style.display = 'inline-block';
      mediaContainer.style.margin = '10px';
      mediaContainer.style.border = '1px solid var(--color-border-light)';
      mediaContainer.style.borderRadius = '8px';
      mediaContainer.style.overflow = 'hidden';

      // Создаем крестик для удаления
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '5px';
      closeBtn.style.right = '5px';
      closeBtn.style.width = '24px';
      closeBtn.style.height = '24px';
      closeBtn.style.background = 'rgba(255, 71, 87, 0.9)';
      closeBtn.style.color = 'white';
      closeBtn.style.border = 'none';
      closeBtn.style.borderRadius = '50%';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.fontSize = '18px';
      closeBtn.style.display = 'flex';
      closeBtn.style.alignItems = 'center';
      closeBtn.style.justifyContent = 'center';
      closeBtn.style.zIndex = '10';

      closeBtn.onclick = function () {
        mediaContainer.remove();
      };

      // Добавляем медиа
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '200px';
        img.style.maxHeight = '150px';
        img.style.display = 'block';
        mediaContainer.appendChild(img);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.style.maxWidth = '200px';
        video.style.maxHeight = '150px';
        video.style.display = 'block';
        mediaContainer.appendChild(video);
      }

      mediaContainer.appendChild(closeBtn);

      // Вставляем в редактор
      const editor = document.getElementById('editor');
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      // Вставляем медиа и добавляем перенос строки
      range.insertNode(mediaContainer);

      // Добавляем перенос строки после медиа
      const br = document.createElement('br');
      mediaContainer.parentNode.insertBefore(br, mediaContainer.nextSibling);

      // Перемещаем курсор после медиа
      const newRange = document.createRange();
      newRange.setStartAfter(br);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    };

    reader.readAsDataURL(file);
  };

  input.click();
};
// ===== ПРОВЕРКА АКТИВНЫХ КНОПОК =====
function checkActiveButtons() {
  const editor = document.getElementById('editor');
  const selection = window.getSelection();
  const node = selection.focusNode;

  // Сбрасываем все активные классы
  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  if (!node || node === editor) return;

  // Проверяем форматирование
  let currentNode = node;
  while (currentNode && currentNode !== editor) {
    const tagName = currentNode.nodeName?.toLowerCase();

    // Жирный
    if (tagName === 'strong' || tagName === 'b') {
      document.querySelector('[onclick="formatText(\'bold\')"]')?.classList.add('active');
    }
    // Курсив
    if (tagName === 'em' || tagName === 'i') {
      document.querySelector('[onclick="formatText(\'italic\')"]')?.classList.add('active');
    }
    // Подчеркнутый
    if (tagName === 'u') {
      document.querySelector('[onclick="formatText(\'underline\')"]')?.classList.add('active');
    }
    // Заголовки
    if (tagName?.match(/^h[1-6]$/)) {
      const level = parseInt(tagName[1]);
      document.querySelector(`[onclick="insertHeading(${level})"]`)?.classList.add('active');
    }
    // Списки
    if (tagName === 'ul') {
      document.querySelector('[onclick="insertList(\'ul\')"]')?.classList.add('active');
    }
    if (tagName === 'ol') {
      document.querySelector('[onclick="insertList(\'ol\')"]')?.classList.add('active');
    }
    // Цитата
    if (tagName === 'blockquote') {
      document.querySelector('[onclick="insertQuote()"]')?.classList.add('active');
    }

    currentNode = currentNode.parentNode;
  }
}

// ===== УДАЛЕНИЕ ФОТО/ВИДЕО =====
function setupMediaDeletion(editor) {
  editor.addEventListener('keydown', function (e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const selection = window.getSelection();
      const node = selection.focusNode;

      // Проверяем, не выделен ли img или video
      let parent = node;
      while (parent && parent !== editor) {
        if (parent.nodeName === 'IMG' || parent.nodeName === 'VIDEO') {
          // Удаляем элемент
          parent.remove();
          e.preventDefault();
          break;
        }
        parent = parent.parentNode;
      }
    }
  });

  // Добавляем обработчик клика для выделения
  editor.addEventListener('click', function (e) {
    const target = e.target;
    if (target.nodeName === 'IMG' || target.nodeName === 'VIDEO') {
      // Выделяем элемент
      const range = document.createRange();
      range.selectNode(target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ DOM загружен');

  const editor = document.getElementById('editor');
  if (editor) {
    console.log('✅ Редактор найден');

    // Добавляем обработчики
    editor.addEventListener('mouseup', checkActiveButtons);
    editor.addEventListener('keyup', checkActiveButtons);

    // Добавляем удаление фото/видео
    setupMediaDeletion(editor);

  } else {
    console.error('❌ Редактор не найден!');
  }
});

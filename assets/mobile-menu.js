// assets/mobile-menu.js
function initModernMenu() {
  console.log('🔧 Инициализация мобильного меню...');

  const burgerBtn = document.querySelector('.mobile-menu-btn');
  const menu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const closeBtn = document.querySelector('.mobile-menu__close');

  // Проверяем все элементы
  console.log('Бургер:', burgerBtn);
  console.log('Меню:', menu);
  console.log('Оверлей:', overlay);
  console.log('Кнопка закрытия:', closeBtn);

  if (!burgerBtn || !menu) {
    console.error('❌ Критические элементы меню не найдены!');
    return;
  }

  // Убираем все старые обработчики (на всякий случай)
  const newBurger = burgerBtn.cloneNode(true);
  burgerBtn.parentNode.replaceChild(newBurger, burgerBtn);

  const newClose = closeBtn ? closeBtn.cloneNode(true) : null;
  if (closeBtn && newClose) {
    closeBtn.parentNode.replaceChild(newClose, closeBtn);
  }

  // Получаем новые ссылки
  const finalBurger = document.querySelector('.mobile-menu-btn');
  const finalClose = document.querySelector('.mobile-menu__close');
  const finalOverlay = document.querySelector('.mobile-menu-overlay');

  function openMenu() {
    console.log('📱 Открываем меню');
    menu.classList.add('active');
    if (finalOverlay) finalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    finalBurger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    console.log('📱 Закрываем меню');
    menu.classList.remove('active');
    if (finalOverlay) finalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    finalBurger.setAttribute('aria-expanded', 'false');
  }

  // Вешаем новые обработчики
  finalBurger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openMenu();
  });

  if (finalClose) {
    finalClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }

  if (finalOverlay) {
    finalOverlay.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });

  console.log('✅ Мобильное меню готово');
}

// Запускаем после полной загрузки
if (document.readyState === 'complete') {
  setTimeout(initModernMenu, 100);
} else {
  window.addEventListener('load', () => setTimeout(initModernMenu, 100));
}

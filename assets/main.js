/**
 * ГЛАВНЫЙ ФАЙЛ СКРИПТОВ
 * С умной анимацией шапки
 */

document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ Standoff 2 Forum loaded successfully!');

  initBurgerMenu();
  initScrollTopButton();
  initNumberAnimation();
  initScrollAnimation();
  initSmoothScroll();
  initSmartHeader(); // Новая функция для умной шапки
});

/**
 * УМНАЯ ШАПКА
 * Появляется после определенного усилия скролла
 */
function initSmartHeader() {
  const header = document.querySelector('.navbar');
  if (!header) return;

  let lastScrollTop = 0;
  let scrollThreshold = 20;
  let ticking = false;

  // Добавляем начальные стили для анимации
  header.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease';
  header.style.willChange = 'transform';

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Определяем направление скролла
        const isScrollingDown = scrollTop > lastScrollTop;

        // Логика для всех устройств
        if (!isScrollingDown && scrollTop > 50) {
          // Скроллим вверх И не в самом верху - показываем шапку
          header.style.transform = 'translateY(0)';
          header.style.background = 'rgba(15, 15, 26, 0.95)';
        } else if (isScrollingDown && scrollTop > 100) {
          // Скроллим вниз и достаточно далеко - прячем
          header.style.transform = 'translateY(-100%)';
        } else if (scrollTop < 10) {
          // В самом верху - всегда показываем
          header.style.transform = 'translateY(0)';
        }

        // Добавляем класс для изменения фона
        if (scrollTop > 50) {
          header.classList.add('navbar--scrolled');
        } else {
          header.classList.remove('navbar--scrolled');
        }

        lastScrollTop = scrollTop;
        ticking = false;
      });

      ticking = true;
    }
  });

  // Плавное появление при загрузке
  setTimeout(() => {
    header.style.transform = 'translateY(0)';
  }, 100);
}

/**
 * БУРГЕР-МЕНЮ
 */
function initBurgerMenu() {
  const burgerBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const closeBtn = document.querySelector('.mobile-menu__close');

  if (!burgerBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    burgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  // Открытие по кнопке бургер
  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openMenu();
  });

  // Закрытие по крестику
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Закрытие по оверлею
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Закрытие по ссылкам в меню
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}
/**
 * КНОПКА "НАВЕРХ"
 */
function initScrollTopButton() {
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.pageYOffset > 300);
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * АНИМАЦИЯ ЧИСЕЛ
 */
function initNumberAnimation() {
  const numberElements = document.querySelectorAll('.hero__number, .stat-number');
  if (numberElements.length === 0) return;

  const animateNumbers = () => {
    numberElements.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      if (!target || isNaN(target)) return;

      let current = 0;
      const steps = 60;
      const stepValue = target / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += stepValue;

        if (step >= steps) {
          stat.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current).toLocaleString();
        }
      }, 16);
    });
  };

  setTimeout(animateNumbers, 500);
}

/**
 * АНИМАЦИЯ ПРИ ПРОКРУТКЕ
 */
function initScrollAnimation() {
  const animatedElements = document.querySelectorAll(
    '.categories__card, .feature__card, .topic'
  );

  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * ПЛАВНАЯ НАВИГАЦИЯ
 */
/**
 * ПЛАВНАЯ НАВИГАЦИЯ
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // ❌ ЗДЕСЬ ОШИБКА - закрывает не то меню
        const menu = document.querySelector('.header__nav');  // СТАРОЕ МЕНЮ
        const burgerBtn = document.querySelector('.mobile-menu-btn');

        // ✅ ДОЛЖНО БЫТЬ ТАК:
        const mobileMenu = document.querySelector('.mobile-menu');  // НОВОЕ МЕНЮ

        if (mobileMenu?.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
          const icon = burgerBtn?.querySelector('i');
          if (icon) icon.className = 'fas fa-bars';
          burgerBtn?.setAttribute('aria-expanded', 'false');
        }

        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

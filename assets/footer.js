/**
 * Универсальный footer для всех страниц
 * Автоматически создаёт footer перед </body>
 */

document.addEventListener('DOMContentLoaded', function () {
  const footerHTML = `
  <footer class="footer" role="contentinfo">
    <div class="container footer__container">
      <div class="footer__content">
        <div class="footer__column">
          <h3 class="footer__title">Standoff2Forum</h3>
          <p class="footer__descr">Крупнейшее русскоязычное сообщество игроков Standoff 2</p>
          <div class="social">
            <a href="#" class="social__link" aria-label="ВКонтакте"><i class="fab fa-vk social__icon" aria-hidden="true"></i></a>
            <a href="#" class="social__link" aria-label="Telegram"><i class="fab fa-telegram social__icon" aria-hidden="true"></i></a>
            <a href="#" class="social__link" aria-label="YouTube"><i class="fab fa-youtube social__icon" aria-hidden="true"></i></a>
            <a href="#" class="social__link" aria-label="Discord"><i class="fab fa-discord social__icon" aria-hidden="true"></i></a>
          </div>
        </div>

        <div class="footer__column">
          <h4 class="footer__subtitle">Разделы форума</h4>
          <ul class="footer__list">
            <li class="footer__item"><a href="forum.html?category=Обсуждение%20игры" class="footer__link">Обсуждение игры</a></li>
            <li class="footer__item"><a href="teams.html" class="footer__link">Поиск команды</a></li>
            <li class="footer__item"><a href="trade.html" class="footer__link">Торговля</a></li>
            <li class="footer__item"><a href="guides.html" class="footer__link">Гайды</a></li>
          </ul>
        </div>

        <div class="footer__column">
          <h4 class="footer__subtitle">Полезное</h4>
          <ul class="footer__list">
            <li class="footer__item"><a href="forum.html" class="footer__link">Правила форума</a></li>
            <li class="footer__item"><a href="#" class="footer__link">Частые вопросы</a></li>
            <li class="footer__item"><a href="#" class="footer__link">Контакты</a></li>
          </ul>
        </div>

        <div class="footer__column">
          <h4 class="footer__subtitle">Standoff 2</h4>
          <ul class="footer__list">
            <li class="footer__item"><a href="#" class="footer__link" target="_blank" rel="noopener">Официальный сайт</a></li>
            <li class="footer__item"><a href="#" class="footer__link" target="_blank" rel="noopener">Скачать игру</a></li>
            <li class="footer__item"><a href="#" class="footer__link" target="_blank" rel="noopener">Поддержка</a></li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copyright">&copy; 2026 Standoff2Forum. Все права защищены.</p>
        <p class="footer__disclaimer">Это фанатский проект и не связан с разработчиками Standoff 2.</p>
      </div>
    </div>
  </footer>

  <!-- Кнопка "Наверх" -->
  <button class="scroll-top-btn" aria-label="Наверх">
    <i class="fas fa-arrow-up" aria-hidden="true"></i>
  </button>
  `;

  // Проверяем, есть ли уже footer на странице
  const existingFooter = document.querySelector('footer.footer');

  if (!existingFooter) {
    // Если footer нет, создаём его перед закрывающим тегом body
    const body = document.querySelector('body');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = footerHTML;

    // Добавляем footer и кнопку наверх в конец body
    body.appendChild(tempDiv.querySelector('footer.footer'));
    body.appendChild(tempDiv.querySelector('.scroll-top-btn'));
  }

  // Кнопка наверх
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('scroll-top-btn--visible');
      } else {
        scrollTopBtn.classList.remove('scroll-top-btn--visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

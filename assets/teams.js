/**
 * СТРАНИЦА ПОИСКА КОМАНДЫ
 */

class TeamsPage {
  constructor() {
    this.teams = ForumDB.getTeams();
    this.filters = {
      rank: 'all',
      role: 'all',
      hasFreeSlots: false,
      query: ''
    };

    this.init();
  }

  init() {
    this.renderFilters();
    this.renderTeams();
    this.initEventListeners();
  }

  renderTeams(teams = this.teams) {
    const container = document.querySelector('.teams__grid');
    if (!container) return;

    if (teams.length === 0) {
      container.innerHTML = `
        <div class="teams__empty">
          <i class="fas fa-users-slash"></i>
          <h3>Команды не найдены</h3>
          <p>Попробуйте изменить параметры поиска</p>
          <button class="btn btn--primary" id="reset-filters">Сбросить фильтры</button>
        </div>
      `;
      return;
    }

    container.innerHTML = teams.map(team => this.renderTeamCard(team)).join('');

    // После отрисовки карточек - инициализируем кнопки
    this.initTeamCardButtons();
  }

  renderTeamCard(team) {
    const winRate = team.wins + team.losses > 0
      ? Math.round((team.wins / (team.wins + team.losses)) * 100)
      : 0;

    return `
      <div class="team-card" data-team-id="${team.id}">
        <div class="team-card__header">
          <div class="team-card__logo">
            <img src="${team.logo || 'assets/teams/default.jpg'}" alt="Логотип ${team.name}" class="team-card__logo-img">
          </div>
          <div class="team-card__info">
            <h3 class="team-card__name">
              ${team.name}
              <span class="team-card__tag">[${team.tag}]</span>
            </h3>
            <div class="team-card__rank">
              <i class="fas fa-trophy"></i>
              ${team.rank}
            </div>
          </div>
        </div>

        <div class="team-card__stats">
          <div class="team-card__stat">
            <i class="fas fa-users"></i>
            <span>${team.members}/${team.maxMembers}</span>
          </div>
          <div class="team-card__stat">
            <i class="fas fa-trophy"></i>
            <span>${team.wins}W - ${team.losses}L</span>
          </div>
          <div class="team-card__stat">
            <i class="fas fa-chart-line"></i>
            <span>${winRate}% WR</span>
          </div>
        </div>

        <p class="team-card__description">${team.description}</p>

        <div class="team-card__requirements">
          <strong>Требования:</strong>
          <p>${team.requirements}</p>
        </div>

        <div class="team-card__roles">
          <strong>Ищем:</strong>
          <div class="team-card__tags">
            ${team.lookingFor.map(role => `
              <span class="team-card__tag role-tag">${role}</span>
            `).join('')}
          </div>
        </div>

        <div class="team-card__footer">
          <a href="profile.html?id=${team.leaderId || '#'}" class="team-card__leader">
            <i class="fas fa-crown"></i>
            ${team.leader}
          </a>
          <button class="btn btn--primary team-card__join-btn" data-team-id="${team.id}">
            Подать заявку
          </button>
        </div>
      </div>
    `;
  }

  // НОВЫЙ МЕТОД - инициализация кнопок на карточках
  initTeamCardButtons() {
    console.log('🔍 Инициализация кнопок подачи заявок...');

    const joinButtons = document.querySelectorAll('.team-card__join-btn');
    console.log('Найдено кнопок:', joinButtons.length);

    joinButtons.forEach(btn => {
      // Убираем старые обработчики
      btn.replaceWith(btn.cloneNode(true));
    });

    // Получаем свежие кнопки
    const freshButtons = document.querySelectorAll('.team-card__join-btn');

    freshButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const teamId = btn.dataset.teamId;
        console.log('Клик по кнопке, teamId:', teamId);

        this.joinTeam(teamId);
      });
    });
  }
  initCustomSelects() {
    console.log('🔍 Инициализация кастомных select...');

    // Удаляем старые
    document.querySelectorAll('.custom-select').forEach(el => el.remove());

    // Находим select для кастомизации
    const selects = document.querySelectorAll('.filters select');
    console.log('Найдено select:', selects.length);

    selects.forEach(select => {
      if (window.CustomSelect) {
        new window.CustomSelect(select);
      }
    });

    // ✅ ДОБАВЛЯЕМ ИНИЦИАЛИЗАЦИЮ ЧЕКБОКСА
    this.initCustomCheckbox();
  }

  // ✅ НОВЫЙ МЕТОД для чекбокса
  initCustomCheckbox() {
    const checkboxWrapper = document.querySelector('.filters__checkbox');
    const checkbox = document.getElementById('filter-slots');

    if (!checkboxWrapper || !checkbox) return;

    // Если нужно добавить обработчик
    checkbox.addEventListener('change', (e) => {
      console.log('Чекбокс изменен:', e.target.checked);
      // Здесь твоя логика фильтрации
    });
  }

  renderFilters() {
    const container = document.querySelector('.filters');
    if (!container) return;

    container.innerHTML = `
    <div class="filters__section">
      <h3 class="filters__title">Фильтры</h3>

      <div class="filters__group">
        <label for="search-query" class="filters__label">Поиск</label>
        <div class="filters__search">
          <i class="fas fa-search"></i>
          <input type="text" id="search-query" class="filters__input" placeholder="Название или описание...">
        </div>
      </div>

      <div class="filters__group">
        <label for="filter-rank" class="filters__label">Ранг</label>
        <select id="filter-rank" class="filters__select custom">
          <option value="all">Любой</option>
          <option value="Легенда">Легенда</option>
          <option value="Мастер">Мастер</option>
          <option value="Элита">Элита</option>
          <option value="Золото">Золото</option>
        </select>
      </div>

      <div class="filters__group">
        <label for="filter-role" class="filters__label">Роль</label>
        <select id="filter-role" class="filters__select custom">
          <option value="all">Любая</option>
          <option value="Снайпер">Снайпер</option>
          <option value="Стрелок">Стрелок</option>
          <option value="Поддержка">Поддержка</option>
          <option value="Лидер">Лидер</option>
        </select>
      </div>

      <!-- ✅ ИСПРАВЛЕННАЯ СТРУКТУРА С ГЛОБАЛЬНЫМ КЛАССОМ -->
      <div class="filters__group">
        <label class="checkbox filters__checkbox">
          <input type="checkbox" id="filter-slots" class="checkbox__input">
          <span class="checkbox__box">
            <i class="fas fa-check checkbox__icon"></i>
          </span>
          <span class="checkbox__text">Только с местами</span>
        </label>
      </div>

      <button class="btn btn--secondary" id="reset-filters">
        <i class="fas fa-redo-alt"></i>
        Сбросить
      </button>
    </div>

    <div class="filters__actions">
      <button class="btn btn--primary" id="create-team">
        <i class="fas fa-plus"></i>
        Создать команду
      </button>
    </div>
  `;

    setTimeout(() => this.initCustomSelects(), 10);
  }

  initEventListeners() {
    // Поиск
    const searchInput = document.getElementById('search-query');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.query = e.target.value;
        this.applyFilters();
      });
    }

    // Фильтр по рангу
    const rankFilter = document.getElementById('filter-rank');
    if (rankFilter) {
      rankFilter.addEventListener('change', (e) => {
        this.filters.rank = e.target.value;
        this.applyFilters();
      });
    }

    // Фильтр по роли
    const roleFilter = document.getElementById('filter-role');
    if (roleFilter) {
      roleFilter.addEventListener('change', (e) => {
        this.filters.role = e.target.value;
        this.applyFilters();
      });
    }

    // Фильтр по местам
    const slotsFilter = document.getElementById('filter-slots');
    if (slotsFilter) {
      slotsFilter.addEventListener('change', (e) => {
        this.filters.hasFreeSlots = e.target.checked;
        this.applyFilters();
      });
    }

    // Кнопка сброса
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFilters());
    }

    // Кнопка создания команды
    const createBtn = document.getElementById('create-team');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        window.location.href = 'create-team.html';
      });
    }
    this.initCustomSelects();
  }

  applyFilters() {
    const filteredTeams = ForumDB.searchTeams({
      rank: this.filters.rank !== 'all' ? this.filters.rank : null,
      role: this.filters.role !== 'all' ? this.filters.role : null,
      hasFreeSlots: this.filters.hasFreeSlots,
      query: this.filters.query
    });

    this.renderTeams(filteredTeams);
  }

  resetFilters() {
    this.filters = {
      rank: 'all',
      role: 'all',
      hasFreeSlots: false,
      query: ''
    };

    // Обновляем UI
    document.getElementById('search-query').value = '';
    document.getElementById('filter-rank').value = 'all';
    document.getElementById('filter-role').value = 'all';
    document.getElementById('filter-slots').checked = false;

    this.renderTeams(this.teams);

    this.initCustomSelects();
  }

  joinTeam(teamId) {
    console.log('joinTeam called with teamId:', teamId);

    const team = ForumDB.getTeam(teamId);
    if (!team) {
      notify('Команда не найдена', 'error');
      return;
    }

    // Проверяем авторизацию
    if (!ForumDB.isAuthenticated()) {
      notify('Чтобы подать заявку, нужно войти в аккаунт', 'info');
      setTimeout(() => window.location.href = 'login.html', 1500);
      return;
    }

    // Проверяем, есть ли место
    if (team.members >= team.maxMembers) {
      notify('В этой команде нет свободных мест', 'error');
      return;
    }

    const currentUser = ForumDB.getCurrentUser();

    // Убираем проверку на already member, так как members - это число
    // В реальном проекте здесь была бы проверка по массиву участников

    notify(`Заявка в команду "${team.name}" отправлена!`, 'success');

    // Меняем текст кнопки
    const btn = document.querySelector(`.team-card__join-btn[data-team-id="${teamId}"]`);
    if (btn) {
      btn.textContent = 'Заявка отправлена';
      btn.disabled = true;
      btn.classList.remove('btn--primary');
      btn.classList.add('btn--secondary');
    }
  }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Страница поиска команды загружена');
  new TeamsPage();
});

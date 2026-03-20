if (typeof ForumDB === 'undefined') {
  console.error('❌ ForumDB не загружен');
  notify('Ошибка загрузки данных', 'error');
  return;
}
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createTeamForm');
  const logoInput = document.getElementById('team-logo');
  const logoPreview = document.getElementById('logo-preview');
  const logoHidden = document.getElementById('logo-hidden');

  // Предпросмотр логотипа
  logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        logoPreview.innerHTML = `<img src="${e.target.result}" alt="Логотип">`;
        logoHidden.value = e.target.result; // Сохраняем base64
      };
      reader.readAsDataURL(file);
    }
  });

  // Предпросмотр команды
  document.getElementById('previewBtn').addEventListener('click', () => {
    const name = document.getElementById('team-name').value;
    const tag = document.getElementById('team-tag').value;
    const rank = document.getElementById('team-rank').value;
    const description = document.getElementById('team-description').value;

    if (!name || !tag || !rank || !description) {
      notify('Заполните обязательные поля для предпросмотра', 'error');
      return;
    }

    const selectedRoles = Array.from(document.querySelectorAll('input[name="lookingFor"]:checked'))
      .map(cb => cb.value);

    const previewWindow = window.open('', 'Предпросмотр команды', 'width=500,height=600');
    previewWindow.document.write(`
  <html>
    <head>
      <title>Предпросмотр: ${name}</title>
      <link rel="stylesheet" href="css/variables.css">
        <link rel="stylesheet" href="css/style.css">
          <style>
            body {
              padding: 30px;
            background: var(--color-bg-primary);
            color: var(--color-text-primary);
            font-family: 'Inter', sans-serif;
                }
            .preview-card {
              max - width: 400px;
            margin: 0 auto;
            background: var(--color-bg-card);
            border: 1px solid var(--color-border-light);
            border-radius: var(--radius-lg);
            padding: 20px;
                }
            .preview-header {
              display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
                }
            .preview-logo {
              width: 60px;
            height: 60px;
            border-radius: 12px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
                }
            .preview-title h2 {
              color: white;
            margin-bottom: 5px;
                }
            .preview-title span {
              color: #667eea;
                }
            .preview-rank {
              display: inline-block;
            padding: 4px 12px;
            background: rgba(102,126,234,0.1);
            color: #667eea;
            border-radius: 20px;
            margin-bottom: 15px;
                }
            .preview-description {
              color: #b0b0b0;
            margin-bottom: 20px;
            line-height: 1.5;
                }
            .preview-roles {
              display: flex;
            flex-wrap: wrap;
            gap: 8px;
                }
            .preview-role {
              padding: 4px 12px;
            background: rgba(102,126,234,0.1);
            color: #667eea;
            border-radius: 20px;
            font-size: 0.9rem;
                }
          </style>
        </head>
        <body>
          <div class="preview-card">
            <div class="preview-header">
              <div class="preview-logo">
                <i class="fas fa-users"></i>
              </div>
              <div class="preview-title">
                <h2>${name}</h2>
                <span>[${tag}]</span>
              </div>
            </div>
            <div class="preview-rank">Ранг: ${rank}</div>
            <div class="preview-description">${description}</div>
            ${selectedRoles.length ? `
                  <div>
                    <strong style="color: white; margin-bottom: 10px; display: block;">Ищем:</strong>
                    <div class="preview-roles">
                      ${selectedRoles.map(role => `<span class="preview-role">${role}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}
          </div>
        </body>
      </html>
      `);
  });

  // Отправка формы
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Проверка авторизации
    if (!ForumDB.isAuthenticated()) {
      notify('Необходимо войти в аккаунт', 'error');
      setTimeout(() => window.location.href = 'login.html', 1500);
      return;
    }

    const user = ForumDB.getCurrentUser();

    // Проверка выбранных ролей
    const selectedRoles = Array.from(document.querySelectorAll('input[name="lookingFor"]:checked'))
      .map(cb => cb.value);

    if (selectedRoles.length === 0) {
      notify('Выберите хотя бы одну роль для поиска', 'error');
      return;
    }

    // Собираем данные
    const teamData = {
      name: document.getElementById('team-name').value,
      tag: document.getElementById('team-tag').value.toUpperCase(),
      rank: document.getElementById('team-rank').value,
      description: document.getElementById('team-description').value,
      requirements: document.getElementById('team-requirements').value,
      maxMembers: parseInt(document.getElementById('team-max-members').value),
      wins: parseInt(document.getElementById('team-wins').value) || 0,
      losses: parseInt(document.getElementById('team-losses').value) || 0,
      lookingFor: selectedRoles,
      logo: logoHidden.value || null,
      contacts: document.getElementById('team-contacts').value || null,
      leader: user.name,
      leaderId: user.id,
      members: 1 // Создатель - первый участник
    };

    // Сохраняем команду
    const teamId = ForumDB.createTeam(teamData);

    notify('Команда успешно создана!', 'success');

    setTimeout(() => {
      window.location.href = `teams.html`;
    }, 1500);
  });
});

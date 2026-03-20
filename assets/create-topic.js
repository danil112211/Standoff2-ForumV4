/**
 * СТРАНИЦА СОЗДАНИЯ ТЕМЫ
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createTopicForm');

  // Проверка авторизации
  if (!ForumDB.isAuthenticated()) {
    notify('Необходимо войти в аккаунт', 'error');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const currentUser = ForumDB.getCurrentUser();

    const topicData = {
      title: document.getElementById('topic-title').value,
      category: document.getElementById('topic-category').value,
      content: document.getElementById('topic-content').value,
      author: currentUser.name,
      authorId: currentUser.id
    };

    // Сохраняем тему
    const newTopicId = ForumDB.createTopic(topicData);

    notify('Тема успешно создана!', 'success');

    // Перенаправляем на новую тему
    setTimeout(() => {
      window.location.href = `topic.html?id=${newTopicId}`;
    }, 1500);
  });
});

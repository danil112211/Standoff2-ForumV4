/**
 * База данных форума (временное хранилище в localStorage)
 * ======================================================
 *
 * Структура:
 * topics: [
 *   {
 *     id: 1,
 *     title: "Обновление 0.37.0",
 *     category: "Обсуждение игры",
 *     author: "ProPlayer228",
 *     date: "2026-03-15T14:30",
 *     views: 1247,
 *     posts: [
 *       {
 *         id: 1,
 *         author: "ProPlayer228",
 *         content: "...",
 *         date: "...",
 *         likes: 24
 *       }
 *     ]
 *   }
 * ]
 */

const ForumDB = {
  // Ключ для localStorage
  storageKey: 'standoff2_forum_data',

  // Инициализация базы данных
  init() {
    if (!localStorage.getItem(this.storageKey)) {
      // Создаем начальные данные
      const initialData = {
        topics: [
          {
            id: 1,
            title: "Обновление 0.37.0 - разбор изменений",
            category: "Обсуждение игры",
            author: "ProPlayer228",
            authorId: 1,
            date: "2026-03-15T14:30",
            views: 1247,
            posts: [
              {
                id: 1,
                author: "ProPlayer228",
                authorId: 1,
                content: `
                  <p>Всем привет! Вышло новое обновление 0.37.0. Давайте разберем основные изменения:</p>

                  <h2>🎮 Изменения геймплея</h2>
                  <ul>
                    <li>Улучшена система подбора игроков по рангу</li>
                    <li>Исправлены баги с застреванием в текстурах на карте Dust2</li>
                    <li>Оптимизирована производительность на слабых устройствах</li>
                  </ul>

                  <h2>🔫 Новые скины</h2>
                  <ul>
                    <li>M4A1 Dragon's Breath (Legendary)</li>
                    <li>AKR-12 Neon Storm (Epic)</li>
                    <li>Knife M9 Crimson Web (Mythical)</li>
                  </ul>

                  <h2>⚙️ Баланс оружия</h2>
                  <ul>
                    <li>SMG-08: урон снижен с 34 до 32</li>
                    <li>M4A1: отдача немного увеличена</li>
                    <li>Deagle: скорость перезарядки уменьшена на 0.2с</li>
                  </ul>

                  <p>Что думаете об обновлении? Пишите в комментариях! 👇</p>
                `,
                date: "2026-03-15T14:30",
                likes: 24
              },
              {
                id: 2,
                author: "SniperMaster",
                authorId: 2,
                content: `
                  <p>Спасибо за подробный разбор! По поводу баланса - изменения в Deagle реально заметны. Стало сложнее играть, но справедливо. А новые скины просто огонь! Особенно M9 Crimson Web 🔥</p>

                  <blockquote>
                    <p>SMG-08: урон снижен с 34 до 32</p>
                  </blockquote>

                  <p>А вот это зря, им и так никто не играл. Теперь вообще бесполезный.</p>
                `,
                date: "2026-03-15T15:45",
                likes: 12
              }
            ]
          },
          {
            id: 2,
            title: "Ищем 5-го игрока в команду (ранг: Легенда)",
            category: "Поиск команды",
            author: "TeamLeader",
            authorId: 3,
            date: "2026-03-15T09:20",
            views: 842,
            posts: [
              {
                id: 1,
                author: "TeamLeader",
                authorId: 3,
                content: `
                  <p>Всем привет! Ищем пятого игрока в команду для участия в турнирах.</p>

                  <h3>Требования:</h3>
                  <ul>
                    <li>Ранг: Легенда и выше</li>
                    <li>Возраст: 14+</li>
                    <li>Наличие микрофона и Discord</li>
                    <li>Опыт игры в команде</li>
                  </ul>

                  <h3>О команде:</h3>
                  <ul>
                    <li>Играем каждый день с 20:00 до 23:00 МСК</li>
                    <li>Участвуем в небольших турнирах</li>
                    <li>Дружный коллектив</li>
                  </ul>

                  <p>Пишите в личку или отвечайте в теме!</p>
                `,
                date: "2026-03-15T09:20",
                likes: 8
              }
            ]
          },
          {
            id: 3,
            title: "Нож M9 Dragon Glass за 0.03",
            category: "Торговля",
            author: "TraderPRO",
            authorId: 4,
            date: "2026-03-14T18:45",
            views: 2391,
            posts: [
              {
                id: 1,
                author: "TraderPRO",
                authorId: 4,
                content: `
                  <p>Продам нож M9 Dragon Glass с Float 0.03!</p>

                  <h3>Характеристики:</h3>
                  <ul>
                    <li>Float: 0.0312 (очень хороший)</li>
                    <li>Статтрек: нет</li>
                    <li>Редкость: Mythical</li>
                  </ul>

                  <p>Цена: 4500 золота (торг уместен)</p>
                  <p>Скриншоты в профиле. Писать в ЛС.</p>
                `,
                date: "2026-03-14T18:45",
                likes: 15
              }
            ]
          },
          {
            id: 4,
            title: "Гайд: как правильно играть со снайперки на Dust2",
            category: "Гайды",
            author: "SniperMaster",
            authorId: 2,
            date: "2026-03-13T11:30",
            views: 4672,
            posts: [
              {
                id: 1,
                author: "SniperMaster",
                authorId: 2,
                content: `
                  <p>Привет, снайперы! Сегодня расскажу про игру на AWP на карте Dust2.</p>

                  <h2>1. Основные позиции</h2>
                  <p>На Dust2 есть несколько ключевых позиций для снайпера:</p>
                  <ul>
                    <li>Пит на миду - отличный обзор</li>
                    <li>Длинные - контроль выхода из тоннеля</li>
                    <li>Площадка на Б - защита от раша</li>
                  </ul>

                  <h2>2. Тайминги</h2>
                  <p>Важно знать время появления противника:</p>
                  <ul>
                    <li>Мид - 8 секунд</li>
                    <li>Длинные - 12 секунд</li>
                    <li>Короткие - 15 секунд</li>
                  </ul>

                  <h2>3. Смена позиций</h2>
                  <p>Никогда не стой на одном месте. После каждого выстрела меняй позицию.</p>

                  <p>Вопросы в комментариях!</p>
                `,
                date: "2026-03-13T11:30",
                likes: 42
              }
            ]
          }
        ],
        users: [
          {
            id: 1,
            name: "ProPlayer228",
            rank: "Ветеран",
            posts: 847,
            registered: "2024-03-15",
            avatar: "assets/avatars/default.jpg"
          },
          {
            id: 2,
            name: "SniperMaster",
            rank: "Снайпер",
            posts: 342,
            registered: "2025-01-20",
            avatar: "assets/avatars/default.jpg"
          },
          {
            id: 3,
            name: "TeamLeader",
            rank: "Капитан команды",
            posts: 1247,
            registered: "2023-05-10",
            avatar: "assets/avatars/default.jpg"
          },
          {
            id: 4,
            name: "TraderPRO",
            rank: "Торговец",
            posts: 563,
            registered: "2024-08-01",
            avatar: "assets/avatars/default.jpg"
          }
        ],
        // Инициализация базы данных
        init() {
          if (!localStorage.getItem(this.storageKey)) {
            // Создаем начальные данные
            const initialData = {
              topics: [
                {
                  id: 1,
                  title: "Обновление 0.37.0 - разбор изменений",
                  category: "Обсуждение игры",
                  author: "ProPlayer228",
                  authorId: 1,
                  date: "2026-03-15T14:30",
                  views: 1247,
                  posts: [
                    {
                      id: 1,
                      author: "ProPlayer228",
                      authorId: 1,
                      content: `
                  <p>Всем привет! Вышло новое обновление 0.37.0. Давайте разберем основные изменения:</p>

                  <h2>🎮 Изменения геймплея</h2>
                  <ul>
                    <li>Улучшена система подбора игроков по рангу</li>
                    <li>Исправлены баги с застреванием в текстурах на карте Dust2</li>
                    <li>Оптимизирована производительность на слабых устройствах</li>
                  </ul>

                  <h2>🔫 Новые скины</h2>
                  <ul>
                    <li>M4A1 Dragon's Breath (Legendary)</li>
                    <li>AKR-12 Neon Storm (Epic)</li>
                    <li>Knife M9 Crimson Web (Mythical)</li>
                  </ul>

                  <h2>⚙️ Баланс оружия</h2>
                  <ul>
                    <li>SMG-08: урон снижен с 34 до 32</li>
                    <li>M4A1: отдача немного увеличена</li>
                    <li>Deagle: скорость перезарядки уменьшена на 0.2с</li>
                  </ul>

                  <p>Что думаете об обновлении? Пишите в комментариях! 👇</p>
                `,
                      date: "2026-03-15T14:30",
                      likes: 24
                    },
                    {
                      id: 2,
                      author: "SniperMaster",
                      authorId: 2,
                      content: `
                  <p>Спасибо за подробный разбор! По поводу баланса - изменения в Deagle реально заметны. Стало сложнее играть, но справедливо. А новые скины просто огонь! Особенно M9 Crimson Web 🔥</p>

                  <blockquote>
                    <p>SMG-08: урон снижен с 34 до 32</p>
                  </blockquote>

                  <p>А вот это зря, им и так никто не играл. Теперь вообще бесполезный.</p>
                `,
                      date: "2026-03-15T15:45",
                      likes: 12
                    }
                  ]
                },
                {
                  id: 2,
                  title: "Ищем 5-го игрока в команду (ранг: Легенда)",
                  category: "Поиск команды",
                  author: "TeamLeader",
                  authorId: 3,
                  date: "2026-03-15T09:20",
                  views: 842,
                  posts: [
                    {
                      id: 1,
                      author: "TeamLeader",
                      authorId: 3,
                      content: `
                  <p>Всем привет! Ищем пятого игрока в команду для участия в турнирах.</p>

                  <h3>Требования:</h3>
                  <ul>
                    <li>Ранг: Легенда и выше</li>
                    <li>Возраст: 14+</li>
                    <li>Наличие микрофона и Discord</li>
                    <li>Опыт игры в команде</li>
                  </ul>

                  <h3>О команде:</h3>
                  <ul>
                    <li>Играем каждый день с 20:00 до 23:00 МСК</li>
                    <li>Участвуем в небольших турнирах</li>
                    <li>Дружный коллектив</li>
                  </ul>

                  <p>Пишите в личку или отвечайте в теме!</p>
                `,
                      date: "2026-03-15T09:20",
                      likes: 8
                    }
                  ]
                },
                {
                  id: 3,
                  title: "Нож M9 Dragon Glass за 0.03",
                  category: "Торговля",
                  author: "TraderPRO",
                  authorId: 4,
                  date: "2026-03-14T18:45",
                  views: 2391,
                  posts: [
                    {
                      id: 1,
                      author: "TraderPRO",
                      authorId: 4,
                      content: `
                  <p>Продам нож M9 Dragon Glass с Float 0.03!</p>

                  <h3>Характеристики:</h3>
                  <ul>
                    <li>Float: 0.0312 (очень хороший)</li>
                    <li>Статтрек: нет</li>
                    <li>Редкость: Mythical</li>
                  </ul>

                  <p>Цена: 4500 золота (торг уместен)</p>
                  <p>Скриншоты в профиле. Писать в ЛС.</p>
                `,
                      date: "2026-03-14T18:45",
                      likes: 15
                    }
                  ]
                },
                {
                  id: 4,
                  title: "Гайд: как правильно играть со снайперки на Dust2",
                  category: "Гайды",
                  author: "SniperMaster",
                  authorId: 2,
                  date: "2026-03-13T11:30",
                  views: 4672,
                  posts: [
                    {
                      id: 1,
                      author: "SniperMaster",
                      authorId: 2,
                      content: `
                  <p>Привет, снайперы! Сегодня расскажу про игру на AWP на карте Dust2.</p>

                  <h2>1. Основные позиции</h2>
                  <p>На Dust2 есть несколько ключевых позиций для снайпера:</p>
                  <ul>
                    <li>Пит на миду - отличный обзор</li>
                    <li>Длинные - контроль выхода из тоннеля</li>
                    <li>Площадка на Б - защита от раша</li>
                  </ul>

                  <h2>2. Тайминги</h2>
                  <p>Важно знать время появления противника:</p>
                  <ul>
                    <li>Мид - 8 секунд</li>
                    <li>Длинные - 12 секунд</li>
                    <li>Короткие - 15 секунд</li>
                  </ul>

                  <h2>3. Смена позиций</h2>
                  <p>Никогда не стой на одном месте. После каждого выстрела меняй позицию.</p>

                  <p>Вопросы в комментариях!</p>
                `,
                      date: "2026-03-13T11:30",
                      likes: 42
                    }
                  ]
                }
              ],
              users: [
                {
                  id: 1,
                  name: "ProPlayer228",
                  rank: "Ветеран",
                  posts: 847,
                  registered: "2024-03-15",
                  avatar: "assets/avatars/default.jpg"
                },
                {
                  id: 2,
                  name: "SniperMaster",
                  rank: "Снайпер",
                  posts: 342,
                  registered: "2025-01-20",
                  avatar: "assets/avatars/default.jpg"
                },
                {
                  id: 3,
                  name: "TeamLeader",
                  rank: "Капитан команды",
                  posts: 1247,
                  registered: "2023-05-10",
                  avatar: "assets/avatars/default.jpg"
                },
                {
                  id: 4,
                  name: "TraderPRO",
                  rank: "Торговец",
                  posts: 563,
                  registered: "2024-08-01",
                  avatar: "assets/avatars/default.jpg"
                }
              ]
            };
            messages: [
              {
                id: 1,
                senderId: 1,  // ProPlayer228
                receiverId: 2, // SniperMaster
                text: "Привет! Как игра?",
                timestamp: "2026-03-18T10:30",
                read: true
              },
              {
                id: 2,
                senderId: 2,
                receiverId: 1,
                text: "Норм, тренируюсь на Dust2",
                timestamp: "2026-03-18T10:32",
                read: true
              }
            ],
              localStorage.setItem(this.storageKey, JSON.stringify(initialData));
            console.log('✅ База данных форума инициализирована');
          }
        },

      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
      console.log('✅ База данных форума инициализирована');
    }
  },

  // Получить все темы (для главной страницы)
  getTopics() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return parsed.topics || [];
    } catch (e) {
      console.error('Ошибка загрузки тем:', e);
      return [];
    }
  },

  // Получить одну тему по ID
  getTopic(id) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    const topic = data?.topics.find(t => t.id === parseInt(id));

    if (topic) {
      // Увеличиваем счетчик просмотров
      topic.views++;
      this.updateTopic(topic);
    }

    return topic;
  },

  // Создать новую тему
  createTopic(topicData) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));

    const newTopic = {
      id: Date.now(), // уникальный ID на основе времени
      title: topicData.title,
      category: topicData.category,
      author: topicData.author,
      authorId: topicData.authorId,
      date: new Date().toISOString(),
      views: 0,
      posts: [
        {
          id: 1,
          author: topicData.author,
          authorId: topicData.authorId,
          content: topicData.content,
          date: new Date().toISOString(),
          likes: 0
        }
      ]
    };

    data.topics.unshift(newTopic); // добавляем в начало
    localStorage.setItem(this.storageKey, JSON.stringify(data));

    return newTopic.id;
  },

  // Добавить ответ в тему
  addPost(topicId, postData) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    const topic = data.topics.find(t => t.id === parseInt(topicId));

    if (topic) {
      const newPost = {
        id: topic.posts.length + 1,
        author: postData.author,
        authorId: postData.authorId,
        content: postData.content,
        date: new Date().toISOString(),
        likes: 0
      };

      topic.posts.push(newPost);
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  },

  // Обновить тему
  updateTopic(updatedTopic) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    const index = data.topics.findIndex(t => t.id === updatedTopic.id);

    if (index !== -1) {
      data.topics[index] = updatedTopic;
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  },

  // Получить пользователя по ID
  getUser(userId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.users.find(u => u.id === parseInt(userId));
  },

  // Получить темы по категории
  getTopicsByCategory(category) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.topics.filter(t => t.category === category) || [];
  },
  // Добавь в объект ForumDB:

  // Получить общее количество пользователей
  getTotalUsers() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.users?.length || 15432; // Если нет данных, возвращаем заглушку
  },

  // Получить самых активных пользователей
  getTopUsers(limit = 6) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data?.users) return [];

    return [...data.users]
      .sort((a, b) => b.posts - a.posts)
      .slice(0, limit);
  },

  // Получить темы по категории
  getTopicsByCategory(category) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.topics?.filter(t => t.category === category) || [];
  },

  // Поиск по темам
  searchTopics(query) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data?.topics) return [];

    const lowerQuery = query.toLowerCase();
    return data.topics.filter(topic =>
      topic.title.toLowerCase().includes(lowerQuery) ||
      topic.posts.some(post => post.content.toLowerCase().includes(lowerQuery))
    );
  },
  // Добавь в объект ForumDB в конец:

  // Получить пользователя по ID
  getUser(userId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.users?.find(u => u.id === parseInt(userId));
  },

  // Получить темы пользователя
  getUserTopics(userId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.topics?.filter(t => t.authorId === parseInt(userId)) || [];
  },

  // Получить сообщения пользователя
  getUserPosts(userId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data?.topics) return [];

    const posts = [];
    data.topics.forEach(topic => {
      topic.posts.forEach(post => {
        if (post.authorId === parseInt(userId)) {
          posts.push({
            ...post,
            topicTitle: topic.title,
            topicId: topic.id
          });
        }
      });
    });

    return posts;
  },
  // Добавь в объект ForumDB в конец:

  // Получить все команды
  getTeams() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data?.teams) {
      // Если команд нет, создаем тестовые данные
      this.initTeams();
      return this.getTeams();
    }
    return data.teams;
  },

  // Инициализация тестовых команд
  initTeams() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));

    data.teams = [
      {
        id: 1,
        name: "Cyber Warriors",
        tag: "CW",
        logo: "assets/teams/cw.jpg",
        rank: "Легенда",
        members: 5,
        maxMembers: 5,
        leader: "ProPlayer228",
        leaderId: 1,
        description: "Ищем сильных игроков для участия в турнирах. Тренировки каждый день с 20:00 МСК.",
        requirements: "Ранг Легенда, возраст 14+, наличие микрофона",
        roles: ["Снайпер", "Стрелок"],
        lookingFor: ["Снайпер"],
        wins: 47,
        losses: 12,
        createdAt: "2026-01-15T10:30"
      },
      {
        id: 2,
        name: "Russian Phoenix",
        tag: "RP",
        logo: "assets/teams/rp.jpg",
        rank: "Мастер",
        members: 4,
        maxMembers: 5,
        leader: "TeamLeader",
        leaderId: 3,
        description: "Дружная команда ищем пятого. Играем для удовольствия, но с амбициями.",
        requirements: "Ранг Мастер, коммуникабельность, позитив",
        roles: ["Стрелок", "Поддержка"],
        lookingFor: ["Стрелок"],
        wins: 23,
        losses: 18,
        createdAt: "2026-02-20T15:45"
      },
      {
        id: 3,
        name: "Sniper Elite",
        tag: "SE",
        logo: "assets/teams/se.jpg",
        rank: "Элита",
        members: 3,
        maxMembers: 5,
        leader: "SniperMaster",
        leaderId: 2,
        description: "Снайперская команда. Учим новичков, играем в тактический стиль.",
        requirements: "Ранг Элита, умение играть с AWP",
        roles: ["Снайпер", "Поддержка"],
        lookingFor: ["Снайпер", "Стрелок"],
        wins: 15,
        losses: 8,
        createdAt: "2026-03-01T09:20"
      },
      {
        id: 4,
        name: "Trade Federation",
        tag: "TF",
        logo: "assets/teams/tf.jpg",
        rank: "Золото",
        members: 5,
        maxMembers: 5,
        leader: "TraderPRO",
        leaderId: 4,
        description: "Команда трейдеров и игроков. У нас лучшие скины!",
        requirements: "Ранг Золото, наличие дорогих скинов",
        roles: ["Стрелок", "Снайпер", "Лидер"],
        lookingFor: ["Лидер"],
        wins: 8,
        losses: 15,
        createdAt: "2026-02-10T11:15"
      },
      {
        id: 5,
        name: "Dust2 Masters",
        tag: "D2M",
        logo: "assets/teams/d2m.jpg",
        rank: "Легенда",
        members: 2,
        maxMembers: 5,
        leader: "DustKing",
        leaderId: 5,
        description: "Ищем игроков для тренировок на Dust2. Знаем все раскидки.",
        requirements: "Ранг Легенда, знание карты Dust2",
        roles: ["Стрелок", "Снайпер", "Поддержка"],
        lookingFor: ["Стрелок", "Снайпер", "Поддержка"],
        wins: 12,
        losses: 5,
        createdAt: "2026-03-05T16:30"
      }
    ];

    localStorage.setItem(this.storageKey, JSON.stringify(data));
  },

  // Получить команду по ID
  getTeam(id) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.teams?.find(t => t.id === parseInt(id));
  },

  // Создать новую команду
  createTeam(teamData) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));

    const newTeam = {
      id: Date.now(),
      ...teamData,
      members: 1,
      createdAt: new Date().toISOString(),
      wins: 0,
      losses: 0
    };

    if (!data.teams) data.teams = [];
    data.teams.push(newTeam);
    localStorage.setItem(this.storageKey, JSON.stringify(data));

    return newTeam.id;
  },

  // Поиск команд по фильтрам
  searchTeams(filters = {}) {
    let teams = this.getTeams();

    if (filters.rank) {
      teams = teams.filter(t => t.rank === filters.rank);
    }

    if (filters.role) {
      teams = teams.filter(t => t.lookingFor.includes(filters.role));
    }

    if (filters.hasFreeSlots) {
      teams = teams.filter(t => t.members < t.maxMembers);
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      teams = teams.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }

    return teams;
  },

  // Добавь в объект ForumDB в конец:

  // Получить все объявления о продаже
  getTrades() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data?.trades) {
      this.initTrades();
      return this.getTrades();
    }
    return data.trades;
  },

  // В функции initTrades() замени на:
  initTrades() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));

    data.trades = [
      {
        id: 1,
        title: "AKR-12 Neon Storm",
        type: "sell",
        category: "rifle",
        stickers: 4, // количество наклеек
        stickerNames: ["Dragon", "Skull", "Flame", "Crown"], // названия наклеек
        float: 0.1245,
        price: 850,
        seller: "StickerCollector",
        sellerId: 6,
        description: "4 наклейки! Редкие позиции, все на видных местах",
        image: "assets/trades/akr-stickers.jpg",
        likes: 8,
        views: 156,
        createdAt: "2026-03-13T10:20",
        status: "active"
      },
      {
        id: 2,
        title: "M4A1 Dragon's Breath",
        type: "sell",
        category: "rifle",
        stickers: 3,
        stickerNames: ["Dragon", "Fire", "Phoenix"],
        float: 0.0891,
        price: 1200,
        seller: "SkinLover",
        sellerId: 7,
        description: "3 наклейки Dragon collection, редкое сочетание",
        image: "assets/trades/m4-dragon.jpg",
        likes: 15,
        views: 234,
        createdAt: "2026-03-12T15:30",
        status: "active"
      }
    ];

    localStorage.setItem(this.storageKey, JSON.stringify(data));
  },

  // Получить объявление по ID
  getTrade(id) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.trades?.find(t => t.id === parseInt(id));
  },

  // Создать новое объявление
  createTrade(tradeData) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));

    const newTrade = {
      id: Date.now(),
      ...tradeData,
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      status: "active"
    };

    if (!data.trades) data.trades = [];
    data.trades.push(newTrade);
    localStorage.setItem(this.storageKey, JSON.stringify(data));

    return newTrade.id;
  },

  // Поиск объявлений по фильтрам
  searchTrades(filters = {}) {
    let trades = this.getTrades();

    if (filters.type && filters.type !== 'all') {
      trades = trades.filter(t => t.type === filters.type);
    }

    if (filters.category && filters.category !== 'all') {
      trades = trades.filter(t => t.category === filters.category);
    }

    if (filters.rarity && filters.rarity !== 'all') {
      trades = trades.filter(t => t.rarity === filters.rarity);
    }

    if (filters.minPrice) {
      trades = trades.filter(t => t.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      trades = trades.filter(t => t.price <= filters.maxPrice);
    }

    if (filters.statTrak) {
      trades = trades.filter(t => t.statTrak === true);
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      trades = trades.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.seller.toLowerCase().includes(query)
      );
    }

    return trades;
  },

  // Получить редкости с цветами
  getRarityInfo(rarity) {
    const rarities = {
      common: { name: 'Обычный', color: '#b0c3d9' },
      rare: { name: 'Редкий', color: '#4b69ff' },
      epic: { name: 'Эпический', color: '#8847ff' },
      legendary: { name: 'Легендарный', color: '#d32ce6' },
      mythical: { name: 'Мифический', color: '#e4ae39' }
    };
    return rarities[rarity] || rarities.common;
  },

  // Добавь в объект ForumDB в конец:

  // Получить все гайды
  getGuides() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data?.guides) {
      this.initGuides();
      return this.getGuides();
    }
    return data.guides;
  },

  // Инициализация тестовых гайдов
  initGuides() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));

    data.guides = [
      {
        id: 1,
        title: "Как правильно играть со снайперской винтовкой",
        description: "Полное руководство по игре с AWP: позиции, тайминги, смена позиций",
        content: `
        <h2>Введение</h2>
        <p>Снайперская винтовка - одно из самых мощных оружий в Standoff 2. В этом гайде я расскажу все нюансы игры с ней.</p>

        <h2>1. Основные позиции на картах</h2>
        <h3>Dust2</h3>
        <ul>
          <li><strong>Мид (пит)</strong> - отличный обзор, можно контролировать выход из тоннеля</li>
          <li><strong>Длинные (лонг)</strong> - классическая позиция, важно знать тайминги</li>
          <li><strong>Площадка Б</strong> - защита от раша, нужно быстро реагировать</li>
        </ul>

        <h3>Inferno</h3>
        <ul>
          <li><strong>Балкон (апартаменты)</strong> - контроль мида и выхода из бананов</li>
          <li><strong>Колокольня</strong> - отличный обзор всей карты</li>
        </ul>

        <h2>2. Тайминги</h2>
        <p>Знание времени появления противника - ключ к успеху:</p>
        <ul>
          <li>Мид на Dust2 - 8 секунд</li>
          <li>Длинные - 12 секунд</li>
          <li>Короткие - 15 секунд</li>
        </ul>

        <h2>3. Смена позиций</h2>
        <p>Никогда не стой на одном месте после выстрела. Опытный игрок сразу поймет вашу позицию.</p>

        <h2>4. Техника стрельбы</h2>
        <ul>
          <li>Только стоя или сидя (с колена)</li>
          <li>Не двигайтесь во время выстрела</li>
          <li>Используйте quick-scope для ближних дистанций</li>
        </ul>
      `,
        category: "Оружие",
        difficulty: "Средний",
        author: "SniperMaster",
        authorId: 2,
        image: "assets/guides/sniper.jpg",
        likes: 342,
        views: 12453,
        rating: 4.8,
        createdAt: "2026-02-15T14:30",
        timeToRead: 12,
        tags: ["снайпер", "awp", "позиции", "тактика"]
      },
      {
        id: 2,
        title: "Как набить фраги на Dust2: полный гайд",
        description: "Все секреты самой популярной карты: раскидки, позиции, тактики",
        content: `
        <h2>Карта Dust2 - классика Standoff 2</h2>
        <p>Dust2 - самая популярная карта в игре. Зная её особенности, вы сможете доминировать в каждом матче.</p>

        <h2>Раскидки гранат</h2>
        <h3>Смоки на мид</h3>
        <p>Встаньте в углу у выхода с базы, прицельтесь в верхний угол здания и киньте смок - он закроет обзор снайперам на миду.</p>

        <h3>Флешки на лонг</h3>
        <p>Из-за стены киньте флешку так, чтобы она разорвалась в воздухе над выходом из тоннеля - ослепит всех, кто там стоит.</p>

        <h2>Позиции для удержания</h2>
        <h3>Защита точки А</h3>
        <ul>
          <li>Гусь (платформа) - отличный обзор</li>
          <li>За ящиками на лонге - неожиданная позиция</li>
          <li>Коробки на площадке - классика</li>
        </ul>

        <h3>Защита точки Б</h3>
        <ul>
          <li>Окно (укрытие) - контроль выхода из тоннеля</li>
          <li>За стеной справа - отличная позиция для засады</li>
        </ul>

        <h2>Тактики для атаки</h2>
        <p>Раскидка на точке А: два игрока идут по лонгу, три через мид и короткие. Это создает давление с двух сторон.</p>
      `,
        category: "Карты",
        difficulty: "Новичок",
        author: "DustMaster",
        authorId: 10,
        image: "assets/guides/dust2.jpg",
        likes: 287,
        views: 8976,
        rating: 4.6,
        createdAt: "2026-02-10T09:15",
        timeToRead: 8,
        tags: ["dust2", "тактика", "раскидки", "позиции"]
      },
      {
        id: 3,
        title: "Тренировка аима: упражнения для профи",
        description: "Комплекс упражнений для развития реакции и точности",
        content: `
        <h2>Как тренировать аим</h2>
        <p>Аим - это навык, который требует постоянной практики. Вот лучшие упражнения:</p>

        <h2>1. Deathmatch</h2>
        <p>Самый эффективный способ тренировки. Заходите в Deathmatch и играйте только с выбранным оружием. Старайтесь делать только хедшоты.</p>

        <h2>2. Тренировка с ботами</h2>
        <p>Создайте локальную игру с ботами и отрабатывайте:</p>
        <ul>
          <li>Фраги на бегу</li>
          <li>Стрельба после разворота на 180°</li>
          <li>Контроль спрея (разброса пуль)</li>
        </ul>

        <h2>3. Aim Lab</h2>
        <p>Используйте специальные тренажеры для аима. 15 минут в день дадут отличный результат через неделю.</p>

        <h2>Упражнения</h2>
        <h3>"Тренировка на одной точке"</h3>
        <p>Встаньте напротив стены и стреляйте в одну точку, контролируя спрей. Повторяйте, пока пули не будут ложиться в одну точку.</p>

        <h3>"Тренировка на движущихся мишенях"</h3>
        <p>Включите ботов, которые бегают, и отрабатывайте стрельбу по движущимся целям.</p>
      `,
        category: "Тренировки",
        difficulty: "Профи",
        author: "AimGod",
        authorId: 11,
        image: "assets/guides/aim.jpg",
        likes: 567,
        views: 15678,
        rating: 4.9,
        createdAt: "2026-02-05T11:20",
        timeToRead: 10,
        tags: ["аим", "тренировка", "реакция", "точность"]
      },
      {
        id: 4,
        title: "Гайд по оружию: все характеристики и применение",
        description: "Подробный разбор всего оружия в Standoff 2: урон, отдача, цена, лучшие дистанции",
        content: `
        <h2>Винтовки</h2>

        <h3>AKR-12</h3>
        <ul>
          <li><strong>Урон:</strong> 32</li>
          <li><strong>Бронепробитие:</strong> 85%</li>
          <li><strong>Скорострельность:</strong> 600 выстр/мин</li>
          <li><strong>Цена:</strong> 2700 золота</li>
          <li><strong>Спрей:</strong> Сильный, требует контроля</li>
        </ul>
        <p>Лучшее оружие для агрессивной игры. Первые 3 пули летят точно, потом сильный разброс. Тренируйте контроль спрея.</p>

        <h3>M4A1</h3>
        <ul>
          <li><strong>Урон:</strong> 30</li>
          <li><strong>Бронепробитие:</strong> 82%</li>
          <li><strong>Скорострельность:</strong> 685 выстр/мин</li>
          <li><strong>Цена:</strong> 2900 золота</li>
          <li><strong>Спрей:</strong> Легкий, легко контролировать</li>
        </ul>
        <p>Идеальна для удержания позиций. Точная, легкая отдача, хороша на любых дистанциях.</p>

        <h2>Пистолеты-пулеметы</h2>

        <h3>SMG-08</h3>
        <ul>
          <li><strong>Урон:</strong> 28</li>
          <li><strong>Бронепробитие:</strong> 65%</li>
          <li><strong>Скорострельность:</strong> 800 выстр/мин</li>
          <li><strong>Цена:</strong> 1500 золота</li>
        </ul>
        <p>Отлична для раундов с эко. Высокая скорострельность, но слабое бронепробитие.</p>

        <h2>Снайперские винтовки</h2>

        <h3>AWP</h3>
        <ul>
          <li><strong>Урон:</strong> 115</li>
          <li><strong>Бронепробитие:</strong> 95%</li>
          <li><strong>Цена:</strong> 4750 золота</li>
        </ul>
        <p>Убивает с одного выстрела в любую часть тела. Медленная перезарядка, требует точности.</p>
      `,
        category: "Оружие",
        difficulty: "Новичок",
        author: "WeaponExpert",
        authorId: 12,
        image: "assets/guides/weapons.jpg",
        likes: 423,
        views: 21345,
        rating: 4.7,
        createdAt: "2026-01-28T16:40",
        timeToRead: 15,
        tags: ["оружие", "характеристики", "урон", "сравнение"]
      },
      {
        id: 5,
        title: "Тактики для игры в команде",
        description: "Как играть с командой: коммуникация, роли, стратегии",
        content: `
        <h2>Командная игра - ключ к победе</h2>
        <p>Даже имея отличный аим, без командной игры сложно побеждать сильных соперников.</p>

        <h2>Роли в команде</h2>
        <ul>
          <li><strong>Капитан (IGL)</strong> - принимает решения, дает команды</li>
          <li><strong>Снайпер</strong> - держит дальние дистанции, дает информацию</li>
          <li><strong>Стрелок (Рифлер)</strong> - основа команды, заходит на точки</li>
          <li><strong>Поддержка</strong> - кидает гранаты, помогает тиммейтам</li>
        </ul>

        <h2>Коммуникация</h2>
        <p>Что нужно сообщать команде:</p>
        <ul>
          <li>Позиции врагов ("Миду один")</li>
          <li>Количество ("Лонгу трое")</li>
          <li>Дамаг ("АКР снял 70")</li>
          <li>Планы ("Заходим на А")</li>
        </ul>

        <h2>Стандартные тактики</h2>
        <h3>Раскидка (Rush)</h3>
        <p>Вся команда быстро идет на одну точку. Нужны флешки и быстрая реакция.</p>

        <h3>Сплит (Split)</h3>
        <p>Разделение на две группы для атаки с разных направлений. Пример: двое через катакомбы, трое через длинные.</p>

        <h3>Фейк (Fake)</h3>
        <p>Имитация атаки на одну точку, чтобы потом ударить по другой. Двое шумят на А, трое тихо идут на Б.</p>
      `,
        category: "Тактика",
        difficulty: "Средний",
        author: "TeamLeader",
        authorId: 3,
        image: "assets/guides/tactics.jpg",
        likes: 298,
        views: 9876,
        rating: 4.5,
        createdAt: "2026-01-20T12:10",
        timeToRead: 8,
        tags: ["тактика", "команда", "коммуникация", "стратегия"]
      },
      {
        id: 6,
        title: "Настройки для слабых ПК (FPS guide)",
        description: "Как повысить FPS на слабых устройствах для комфортной игры",
        content: `
        <h2>Как повысить FPS в Standoff 2</h2>
        <p>Если у вас слабое устройство, эти настройки помогут повысить производительность.</p>

        <h2>Графические настройки</h2>
        <ul>
          <li><strong>Качество графики:</strong> Низкое</li>
          <li><strong>Тени:</strong> Выключить</li>
          <li><strong>Сглаживание:</strong> Выключить</li>
          <li><strong>Текстуры:</strong> Низкие</li>
          <li><strong>Эффекты:</strong> Минимум</li>
        </ul>

        <h2>Настройки в файлах</h2>
        <p>На Android можно отредактировать файл конфигурации:</p>
        <ol>
          <li>Найдите папку Android/data/com.axlebolt.standoff2/files</li>
          <li>Откройте файл settings.cfg</li>
          <li>Измените значения на минимальные</li>
        </ol>

        <h2>Дополнительные советы</h2>
        <ul>
          <li>Закройте все фоновые приложения</li>
          <li>Включите режим "Производительность" в настройках телефона</li>
          <li>Очистите кэш игры</li>
          <li>Не используйте кастомные скины (они снижают FPS)</li>
        </ul>
      `,
        category: "Настройки",
        difficulty: "Новичок",
        author: "TechGuru",
        authorId: 13,
        image: "assets/guides/fps.jpg",
        likes: 189,
        views: 5432,
        rating: 4.3,
        createdAt: "2026-01-15T08:30",
        timeToRead: 5,
        tags: ["fps", "настройки", "оптимизация", "производительность"]
      }
    ];

    localStorage.setItem(this.storageKey, JSON.stringify(data));
  },

  // Получить гайд по ID
  getGuide(id) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    const guide = data?.guides?.find(g => g.id === parseInt(id));

    if (guide) {
      guide.views++;
      this.updateGuide(guide);
    }

    return guide;
  },

  // Создать новый гайд
  createGuide(guideData) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));

    const newGuide = {
      id: Date.now(),
      ...guideData,
      likes: 0,
      views: 0,
      rating: 0,
      createdAt: new Date().toISOString()
    };

    if (!data.guides) data.guides = [];
    data.guides.push(newGuide);
    localStorage.setItem(this.storageKey, JSON.stringify(data));

    return newGuide.id;
  },

  // Обновить гайд
  updateGuide(updatedGuide) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    const index = data.guides.findIndex(g => g.id === updatedGuide.id);

    if (index !== -1) {
      data.guides[index] = updatedGuide;
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  },

  // Поиск гайдов по фильтрам
  searchGuides(filters = {}) {
    let guides = this.getGuides();

    if (filters.category && filters.category !== 'all') {
      guides = guides.filter(g => g.category === filters.category);
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
      guides = guides.filter(g => g.difficulty === filters.difficulty);
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      guides = guides.filter(g =>
        g.title.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        g.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.sort) {
      switch (filters.sort) {
        case 'newest':
          guides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'popular':
          guides.sort((a, b) => b.views - a.views);
          break;
        case 'rating':
          guides.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    return guides;
  },
  // Добавь в объект ForumDB в конец:

  // Текущий пользователь (сессия)
  currentUser: null,

  // Регистрация нового пользователя
  registerUser(userData) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));

    if (!data.users) data.users = [];

    // Проверяем, не занят ли email или имя
    const existingUser = data.users.find(u =>
      u.email === userData.email || u.name === userData.username
    );

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error('Этот email уже зарегистрирован');
      }
      if (existingUser.name === userData.username) {
        throw new Error('Это имя пользователя уже занято');
      }
    }

    // Создаем нового пользователя
    const newUser = {
      id: Date.now(),
      name: userData.username,
      email: userData.email,
      password: this.hashPassword(userData.password), // В реальном проекте хешируем
      rank: 'Новичок',
      posts: 0,
      registered: new Date().toISOString(),
      avatar: 'assets/avatars/default.jpg',
      gameId: userData.so2Id,
      achievements: [],
      settings: {
        theme: 'dark',
        notifications: userData.notifications || false
      }
    };

    data.users.push(newUser);
    localStorage.setItem(this.storageKey, JSON.stringify(data));

    // Сразу логиним пользователя
    this.currentUser = newUser;
    this.saveSession(newUser);

    return newUser;
  },
  // Получить сообщения пользователя
  getMessages(userId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.messages?.filter(m =>
      m.senderId === parseInt(userId) || m.receiverId === parseInt(userId)
    ) || [];
  },

  // Отправить сообщение
  sendMessage(messageData) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data.messages) data.messages = [];

    const newMessage = {
      id: Date.now(),
      ...messageData
    };

    data.messages.push(newMessage);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    return newMessage;
  },

  // Отметить сообщение как прочитанное
  markMessageAsRead(messageId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    const message = data.messages?.find(m => m.id === messageId);
    if (message) {
      message.read = true;
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  },

  // Удалить диалог
  deleteDialog(userId1, userId2) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    data.messages = data.messages?.filter(m =>
      !(m.senderId === userId1 && m.receiverId === userId2) &&
      !(m.senderId === userId2 && m.receiverId === userId1)
    ) || [];
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  },
  // Вход пользователя
  loginUser(email, password) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));

    const user = data.users.find(u =>
      (u.email === email || u.name === email) &&
      u.password === this.hashPassword(password)
    );

    if (!user) {
      throw new Error('Неверный email/имя или пароль');
    }

    this.currentUser = user;
    this.saveSession(user);

    return user;
  },

  // Выход пользователя
  logoutUser() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  },

  // Сохранить сессию
  saveSession(user, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('currentUser', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      rank: user.rank,
      avatar: user.avatar
    }));
  },

  // Загрузить сессию при старте
  loadSession() {
    // Сначала проверяем localStorage (запомнили меня)
    let userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      return this.currentUser;
    }

    // Потом sessionStorage
    userData = sessionStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      return this.currentUser;
    }

    return null;
  },

  // Проверка авторизации
  isAuthenticated() {
    return this.currentUser !== null;
  },

  // Простой хеш пароля (только для демо!)
  hashPassword(password) {
    // В реальном проекте используй bcrypt или другой безопасный хеш
    // Это просто для демонстрации!
    return btoa(password); // НЕ ИСПОЛЬЗОВАТЬ В РЕАЛЬНЫХ ПРОЕКТАХ!
  },

  // Получить количество онлайн пользователей (имитация)
  getOnlineUsers() {
    return Math.floor(Math.random() * 100) + 50;
  },

  getUsers() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.users || [];
  },

  // ===== ПОЛЬЗОВАТЕЛИ =====
  getCurrentUser() {
    return this.currentUser;
  },

  updateUserProfile(userId, newData) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    const userIndex = data.users.findIndex(u => u.id === parseInt(userId));

    if (userIndex !== -1) {
      // Обновляем пользователя в базе
      data.users[userIndex] = { ...data.users[userIndex], ...newData };
      localStorage.setItem(this.storageKey, JSON.stringify(data));

      // Обновляем текущего пользователя
      if (this.currentUser && this.currentUser.id === parseInt(userId)) {
        this.currentUser = { ...this.currentUser, ...newData };

        // Сохраняем сессию с обновлёнными данными
        this.saveSession(this.currentUser, !!localStorage.getItem('currentUser'));

        console.log('✅ Профиль обновлён:', this.currentUser);
      }
      return true;
    }
    console.error('❌ Пользователь не найден');
    return false;
  },
  updatePost(topicId, postId, updatedData) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    const topic = data.topics.find(t => t.id === parseInt(topicId));

    if (topic) {
      const post = topic.posts.find(p => p.id === parseInt(postId));
      if (post) {
        Object.assign(post, updatedData);
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        return true;
      }
    }
    return false;
  },
  // Получить количество непрочитанных сообщений
  getUnreadMessagesCount(userId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data?.messages) return 0;

    return data.messages.filter(m =>
      m.receiverId === parseInt(userId) && !m.read
    ).length;
  },

  // Получить количество непрочитанных уведомлений
  getUnreadNotificationsCount(userId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data?.notifications) return 0;

    return data.notifications.filter(n =>
      n.userId === parseInt(userId) && !n.read
    ).length;
  },
  // ===== СООБЩЕНИЯ =====
  getMessages(userId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.messages?.filter(m =>
      m.senderId === parseInt(userId) || m.receiverId === parseInt(userId)
    ) || [];
  },

  sendMessage(messageData) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data.messages) data.messages = [];

    const newMessage = {
      id: Date.now(),
      ...messageData,
      timestamp: new Date().toISOString(),
      read: false
    };

    data.messages.push(newMessage);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    return newMessage;
  },

  // ===== УВЕДОМЛЕНИЯ =====
  getNotifications(userId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.notifications?.filter(n => n.userId === parseInt(userId)) || [];
  },

  addNotification(notificationData) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data.notifications) data.notifications = [];

    const newNotification = {
      id: Date.now(),
      ...notificationData,
      timestamp: new Date().toISOString(),
      read: false
    };

    data.notifications.push(newNotification);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    return newNotification;
  },

  markNotificationAsRead(notificationId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    const notification = data.notifications?.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  },

  markAllNotificationsAsRead(userId) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    data.notifications?.forEach(n => {
      if (n.userId === parseInt(userId)) n.read = true;
    });
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  },

  // ===== ИЗБРАННОЕ =====
  getFavorites(userId, type) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data?.favorites?.filter(f =>
      f.userId === parseInt(userId) && (!type || f.type === type)
    ) || [];
  },

  addToFavorites(userId, itemId, type) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data.favorites) data.favorites = [];

    const exists = data.favorites.some(f =>
      f.userId === parseInt(userId) && f.itemId === parseInt(itemId) && f.type === type
    );

    if (!exists) {
      data.favorites.push({
        id: Date.now(),
        userId: parseInt(userId),
        itemId: parseInt(itemId),
        type,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  },

  removeFromFavorites(userId, itemId, type) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    data.favorites = data.favorites?.filter(f =>
      !(f.userId === parseInt(userId) && f.itemId === parseInt(itemId) && f.type === type)
    ) || [];
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  },

  // ===== НОВОСТИ =====
  getNews() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (!data.news) {
      this.initNews();
      return this.getNews();
    }
    return data.news;
  },

  initNews() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    data.news = [
      {
        id: 1,
        title: 'Обновление 0.37.0: Новые скины и баланс оружия',
        excerpt: 'В новом обновлении вас ждут M4A1 Dragon\'s Breath, AKR-12 Neon Storm, изменения баланса оружия и улучшение производительности...',
        content: '...',
        category: 'update',
        categoryName: 'Обновление',
        date: '2026-03-15',
        comments: 47,
        views: 12400,
        image: 'assets/news/update-037.jpg',
        featured: true
      },
      // ... остальные новости
    ];
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  },

  // ===== ПОИСК =====
  search(query, filters = {}) {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    const results = [];
    const lowerQuery = query.toLowerCase();

    if (!filters.categories || filters.categories.includes('topics')) {
      data.topics?.forEach(topic => {
        if (topic.title.toLowerCase().includes(lowerQuery) ||
          topic.content?.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'topic',
            id: topic.id,
            title: topic.title,
            author: topic.author,
            authorId: topic.authorId,
            date: topic.date,
            excerpt: topic.content?.substring(0, 200),
            category: topic.category
          });
        }
      });
    }

    if (!filters.categories || filters.categories.includes('guides')) {
      data.guides?.forEach(guide => {
        if (guide.title.toLowerCase().includes(lowerQuery) ||
          guide.description.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'guide',
            id: guide.id,
            title: guide.title,
            author: guide.author,
            authorId: guide.authorId,
            date: guide.createdAt,
            excerpt: guide.description,
            rating: guide.rating
          });
        }
      });
    }

    return results;
  }
};

// Инициализируем базу при загрузке
ForumDB.init();

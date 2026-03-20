// assets/create-trade.js
console.log('✅ create-trade.js загружен');

document.addEventListener('DOMContentLoaded', function () {
  if (!ForumDB.isAuthenticated()) {
    notify('Войдите в аккаунт', 'error');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }

  const currentUser = ForumDB.getCurrentUser();
  let trades = JSON.parse(localStorage.getItem('trades')) || [];

  document.getElementById('createTradeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const newTrade = {
      id: Date.now(),
      type: document.getElementById('tradeType').value,
      category: document.getElementById('tradeCategory').value,
      title: document.getElementById('tradeTitle').value,
      rarity: document.getElementById('tradeRarity').value,
      price: parseInt(document.getElementById('tradePrice').value),
      description: document.getElementById('tradeDescription').value,
      sellerId: currentUser.id,
      seller: currentUser.name,
      date: new Date().toISOString(),
      views: 0,
      likes: 0
    };

    trades.push(newTrade);
    localStorage.setItem('trades', JSON.stringify(trades));

    notify('Объявление создано!', 'success');
    setTimeout(() => window.location.href = 'trade.html', 1500);
  });
});

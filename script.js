const cart = [];
const cartCount = document.getElementById('cartCount');
const cartSummary = document.getElementById('cartSummary');
const orderButton = document.getElementById('orderButton');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}

function formatPrice(value) {
  return new Intl.NumberFormat('ar-DZ').format(value) + ' دج';
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  if (!count) {
    cartSummary.textContent = 'لم تضف أي باقة بعد.';
    orderButton.disabled = true;
  } else {
    cartSummary.textContent = cart.map(item => `${item.name} × ${item.quantity}`).join('، ') +
      ` — المجموع: ${formatPrice(total)}.`;
    orderButton.disabled = false;
  }
}

document.querySelectorAll('.add-button').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, price, quantity: 1 });
    updateCart();
    showToast(`أُضيفت باقة «${name}» إلى السلة`);
  });
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(filter => filter.classList.remove('active'));
    button.classList.add('active');
    const selected = button.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.hidden = selected !== 'all' && card.dataset.category !== selected;
    });
  });
});

document.querySelectorAll('.heart').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('liked');
    button.textContent = button.classList.contains('liked') ? '♥' : '♡';
    showToast(button.classList.contains('liked') ? 'أُضيفت إلى المفضلة' : 'أُزيلت من المفضلة');
  });
});

orderButton.addEventListener('click', () => {
  // غيّر الرقم أدناه إلى رقم واتساب المتجر بصيغة دولية دون + أو مسافات.
  const whatsappNumber = '213000000000';
  if (whatsappNumber === '213000000000') {
    showToast('قبل استقبال الطلبات، غيّر رقم واتساب في ملف script.js إلى رقم متجرك.');
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lines = cart.map(item => `• ${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`);
  const message = `مرحبًا، أريد طلب الباقات التالية:\n${lines.join('\n')}\nالمجموع: ${formatPrice(total)}\nالاسم:\nالعنوان:`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('navMenu').classList.toggle('open');
});
document.querySelectorAll('#navMenu a').forEach(link => {
  link.addEventListener('click', () => document.getElementById('navMenu').classList.remove('open'));
});
document.getElementById('year').textContent = new Date().getFullYear();

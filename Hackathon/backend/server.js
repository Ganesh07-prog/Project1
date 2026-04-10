// ============================================================
//  FreshBite – script.js
// ============================================================

// ---------- STATE ----------
let state = {
  user: null,
  foods: [],
  cart: [],
  wishlist: [],
  orders: [],
  addresses: [],
  selectedAddrType: 'Home',
  currentFood: null,
  fdQty: 1,
  selectedPayMethod: 'cod',
  editingFoodId: null,
  activeCategory: 'all'
};

// ---------- SAMPLE FOOD DATA ----------
const sampleFoods = [
  { id: 1, name: 'Masala Dosa', price: 60, category: 'breakfast', description: 'Crispy rice crepe served with coconut chutney and sambar. Classic South Indian breakfast.', ingredients: 'Rice, Urad Dal, Potatoes, Mustard Seeds, Curry Leaves, Green Chili', expiry: futureDateStr(1), listedOn: new Date().toISOString(), seller: 'Anand Kitchen', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', rating: 4.5, qty: 20 },
  { id: 2, name: 'Paneer Butter Masala', price: 150, category: 'lunch', description: 'Rich and creamy tomato-based curry with paneer cubes. Pairs well with naan or rice.', ingredients: 'Paneer, Tomatoes, Cream, Butter, Onion, Spices', expiry: futureDateStr(2), listedOn: new Date().toISOString(), seller: 'Sharma Dhabha', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', rating: 4.7, qty: 15 },
  { id: 3, name: 'Samosa (2 pcs)', price: 30, category: 'snacks', description: 'Golden fried pastry filled with spiced potato and peas. Served hot with green chutney.', ingredients: 'Flour, Potatoes, Peas, Spices, Oil', expiry: futureDateStr(0), listedOn: new Date().toISOString(), seller: 'Street Bites', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', rating: 4.2, qty: 50 },
  { id: 4, name: 'Gulab Jamun', price: 50, category: 'dessert', description: 'Soft milk-solid balls soaked in rose-flavored sugar syrup. A classic Indian dessert.', ingredients: 'Khoya, Flour, Sugar, Rose Water, Cardamom', expiry: futureDateStr(3), listedOn: new Date().toISOString(), seller: 'Sweet Corner', img: 'https://images.unsplash.com/photo-1666444723261-b3b3b34c73b6?w=400&q=80', rating: 4.8, qty: 30 },
  { id: 5, name: 'Chicken Biryani', price: 200, category: 'dinner', description: 'Aromatic basmati rice cooked with marinated chicken and whole spices. Served with raita.', ingredients: 'Basmati Rice, Chicken, Yogurt, Onion, Saffron, Spices, Ghee', expiry: futureDateStr(1), listedOn: new Date().toISOString(), seller: 'Nawab Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&q=80', rating: 4.9, qty: 10 },
  { id: 6, name: 'Mango Lassi', price: 70, category: 'drinks', description: 'Thick, creamy yogurt-based mango drink. Refreshing and perfect for summer.', ingredients: 'Yogurt, Mango Pulp, Sugar, Cardamom, Ice', expiry: futureDateStr(1), listedOn: new Date().toISOString(), seller: 'Fresh Sips', img: 'https://images.unsplash.com/photo-1613452186003-a45f1c3dba59?w=400&q=80', rating: 4.6, qty: 25 },
  { id: 7, name: 'Chole Bhature', price: 90, category: 'lunch', description: 'Spicy chickpea curry served with fluffy deep-fried bread. A Punjabi favourite.', ingredients: 'Chickpeas, Flour, Spices, Onion, Tomato, Oil', expiry: futureDateStr(2), listedOn: new Date().toISOString(), seller: 'Punjab Da Dhaba', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', rating: 4.4, qty: 20 },
  { id: 8, name: 'Pav Bhaji', price: 80, category: 'snacks', description: 'Spiced mashed vegetable curry served with buttered bread rolls. Mumbai street food classic.', ingredients: 'Mixed Vegetables, Butter, Spices, Pav Bread', expiry: futureDateStr(1), listedOn: new Date().toISOString(), seller: 'Mumbai Bites', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', rating: 4.5, qty: 18 }
];

function futureDateStr(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  loadState();

  const path = window.location.pathname;
  if (path.includes('login.html')) {
    initDashboard();
  } else {
    // index.html
    if (state.user) window.location.href = 'login.html';
  }
});

function loadState() {
  try {
    state.user = JSON.parse(localStorage.getItem('fb_user')) || null;
    state.cart = JSON.parse(localStorage.getItem('fb_cart')) || [];
    state.wishlist = JSON.parse(localStorage.getItem('fb_wishlist')) || [];
    state.orders = JSON.parse(localStorage.getItem('fb_orders')) || [];
    state.addresses = JSON.parse(localStorage.getItem('fb_addresses')) || [];
    const stored = JSON.parse(localStorage.getItem('fb_foods'));
    state.foods = stored && stored.length ? stored : sampleFoods;
  } catch(e) { console.error(e); }
}

function saveState() {
  localStorage.setItem('fb_user', JSON.stringify(state.user));
  localStorage.setItem('fb_cart', JSON.stringify(state.cart));
  localStorage.setItem('fb_wishlist', JSON.stringify(state.wishlist));
  localStorage.setItem('fb_orders', JSON.stringify(state.orders));
  localStorage.setItem('fb_addresses', JSON.stringify(state.addresses));
  localStorage.setItem('fb_foods', JSON.stringify(state.foods));
}

// ---------- AUTH (index.html) ----------
function submitPhone() {
  const phone = document.getElementById('phoneInput').value.trim();
  if (phone.length !== 10 || isNaN(phone)) { alert('Enter a valid 10-digit mobile number.'); return; }
  document.getElementById('displayPhone').textContent = phone;
  switchAuthStep('step-otp');
}

function switchAuthStep(to) {
  document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));
  document.getElementById(to).classList.add('active');
}

function goBack(to) { switchAuthStep(to); }

function otpMove(el, idx) {
  if (el.value.length === 1 && idx < 6) {
    const next = document.querySelectorAll('.otp-box')[idx];
    if (next) next.focus();
  }
}

function verifyOTP() {
  const otp = [...document.querySelectorAll('.otp-box')].map(b => b.value).join('');
  if (otp.length < 6) { alert('Please enter the 6-digit OTP.'); return; }
  // Mock OTP always valid; check if existing user
  const phone = document.getElementById('phoneInput').value.trim();
  const stored = JSON.parse(localStorage.getItem('fb_user'));
  if (stored && stored.phone === phone) {
    // Returning user
    finishLogin(stored);
  } else {
    switchAuthStep('step-profile');
  }
}

function resendOTP() { showToast('OTP resent!'); }

function completeProfile() {
  const name = document.getElementById('nameInput').value.trim();
  const role = document.getElementById('roleSelect').value;
  if (!name || !role) { alert('Please fill your name and select a role.'); return; }
  const phone = document.getElementById('phoneInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const user = { name, phone, email, role, joined: new Date().toISOString() };
  finishLogin(user);
}

function finishLogin(user) {
  state.user = user;
  saveState();
  window.location.href = 'login.html';
}

function googleLogin() { showToast('Google sign-in coming soon!'); }

// ---------- DASHBOARD INIT ----------
function initDashboard() {
  if (!state.user) { window.location.href = 'index.html'; return; }
  updateNavUser();
  updateCartBadge();
  loadFoodGrid();
  document.getElementById('statFoods').textContent = state.foods.length;
  if (state.user.role === 'seller') {
    document.getElementById('sellerBanner').style.display = 'flex';
  }
  // Close dropdown on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-profile-menu')) {
      document.getElementById('profileDropdown').classList.remove('open');
    }
  });
}

function updateNavUser() {
  const u = state.user;
  document.getElementById('navAvatar').textContent = u.name ? u.name[0].toUpperCase() : 'U';
  document.getElementById('navName').textContent = u.name ? u.name.split(' ')[0] : 'User';
  document.getElementById('dropAvatar').textContent = u.name ? u.name[0].toUpperCase() : 'U';
  document.getElementById('dropName').textContent = u.name;
  document.getElementById('dropPhone').textContent = '+91 ' + (u.phone || '');
}

// ---------- NAVIGATION ----------
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(page);
  if (el) el.classList.add('active');

  switch(page) {
    case 'home': loadFoodGrid(); break;
    case 'profile': loadProfile(); break;
    case 'orders': loadOrders(); break;
    case 'cart': loadCart(); break;
    case 'address': loadAddresses(); break;
    case 'wishlist': loadWishlist(); break;
    case 'sell': loadSellerDashboard(); break;
  }

  // Update location display
  if (page === 'address' && state.addresses.length) {
    const a = state.addresses[0];
    document.getElementById('navLocation').textContent = a.city || a.line2 || 'Location';
  }
}

function toggleProfileMenu() {
  document.getElementById('profileDropdown').classList.toggle('open');
}

function logout() {
  state.user = null;
  saveState();
  window.location.href = 'index.html';
}

// ---------- FOOD GRID ----------
function loadFoodGrid() {
  const grid = document.getElementById('foodGrid');
  if (!grid) return;
  let foods = state.foods;
  if (state.activeCategory !== 'all') foods = foods.filter(f => f.category === state.activeCategory);
  grid.innerHTML = foods.length ? foods.map(foodCard).join('') : '<div class="empty-state"><i class="fas fa-utensils"></i><p>No food items found</p></div>';
}

function foodCard(f) {
  const inWish = state.wishlist.some(w => w.id === f.id);
  const expClass = expiryClass(f.expiry);
  const expLabel = expiryLabel(f.expiry);
  const imgHTML = f.img
    ? `<img src="${f.img}" alt="${f.name}" onerror="this.parentElement.innerHTML='<div class=food-card-img-placeholder><i class=fas fa-utensils></i></div>'">`
    : `<div class="food-card-img-placeholder"><i class="fas fa-utensils"></i></div>`;
  return `
    <div class="food-card" onclick="openFoodDetail(${f.id})">
      ${imgHTML}
      <div class="food-card-body">
        <div class="food-card-top">
          <span class="food-card-name">${f.name}</span>
          <span class="food-card-price">₹${f.price}</span>
        </div>
        <div class="food-card-meta">${f.seller} · ⭐ ${f.rating}</div>
        <div class="food-card-expiry ${expClass}"><i class="fas fa-calendar-check"></i>${expLabel}</div>
        <div class="food-card-actions" onclick="event.stopPropagation()">
          <button class="wish-btn ${inWish ? 'active' : ''}" onclick="toggleWish(${f.id},this)"><i class="fas fa-heart"></i></button>
          <button class="add-cart-btn" onclick="addToCart(${f.id})"><i class="fas fa-plus"></i> Add</button>
        </div>
      </div>
    </div>`;
}

function expiryClass(dateStr) {
  if (!dateStr) return '';
  const diff = (new Date(dateStr) - new Date()) / 86400000;
  if (diff < 0) return 'expired';
  if (diff < 1) return 'near';
  return '';
}

function expiryLabel(dateStr) {
  if (!dateStr) return 'No expiry info';
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  if (diff < 0) return 'Expired';
  if (diff === 0) return 'Expires today!';
  if (diff === 1) return 'Expires tomorrow';
  return `Fresh until ${new Date(dateStr).toLocaleDateString('en-IN', {day:'numeric',month:'short'})}`;
}

function filterCategory(cat, btn) {
  state.activeCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadFoodGrid();
}

function searchFood() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const grid = document.getElementById('foodGrid');
  if (!grid) return;
  const filtered = state.foods.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.category.toLowerCase().includes(q) ||
    f.ingredients.toLowerCase().includes(q) ||
    f.seller.toLowerCase().includes(q)
  );
  grid.innerHTML = filtered.length ? filtered.map(foodCard).join('') : '<div class="empty-state"><i class="fas fa-search"></i><p>No results found</p></div>';
}

// ---------- FOOD DETAIL MODAL ----------
function openFoodDetail(id) {
  const f = state.foods.find(x => x.id === id);
  if (!f) return;
  state.currentFood = f;
  state.fdQty = 1;

  document.getElementById('fdName').textContent = f.name;
  document.getElementById('fdPrice').textContent = '₹' + f.price;
  document.getElementById('fdDesc').textContent = f.description || 'No description available.';
  document.getElementById('fdIngredients').textContent = f.ingredients || '—';
  document.getElementById('fdExpiry').textContent = f.expiry ? new Date(f.expiry).toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'}) : '—';
  document.getElementById('fdListed').textContent = f.listedOn ? new Date(f.listedOn).toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'}) : '—';
  document.getElementById('fdSeller').textContent = f.seller || '—';
  document.getElementById('fdCategory').textContent = f.category ? f.category.charAt(0).toUpperCase() + f.category.slice(1) : '—';
  document.getElementById('fdRating').textContent = f.rating + ' / 5 ⭐';
  document.getElementById('fdQty').textContent = '1';

  const inWish = state.wishlist.some(w => w.id === f.id);
  document.getElementById('fdWishBtn').classList.toggle('active', inWish);

  const img = document.getElementById('fdImg');
  if (f.img) { img.src = f.img; img.style.display = 'block'; }
  else img.style.display = 'none';

  document.getElementById('foodDetailModal').style.display = 'flex';
}

function closeFoodDetail() {
  document.getElementById('foodDetailModal').style.display = 'none';
}

function fdChangeQty(delta) {
  state.fdQty = Math.max(1, state.fdQty + delta);
  document.getElementById('fdQty').textContent = state.fdQty;
}

function addToCartFromDetail() {
  if (!state.currentFood) return;
  for (let i = 0; i < state.fdQty; i++) addToCart(state.currentFood.id, true);
  showToast(`${state.fdQty}× ${state.currentFood.name} added to cart`);
  closeFoodDetail();
}

function toggleWishFromDetail() {
  if (!state.currentFood) return;
  toggleWish(state.currentFood.id);
  const inWish = state.wishlist.some(w => w.id === state.currentFood.id);
  document.getElementById('fdWishBtn').classList.toggle('active', inWish);
}

// ---------- CART ----------
function addToCart(id, silent = false) {
  const f = state.foods.find(x => x.id === id);
  if (!f) return;
  const existing = state.cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else state.cart.push({ ...f, qty: 1 });
  saveState();
  updateCartBadge();
  if (!silent) showToast(`${f.name} added to cart`);
}

function updateCartBadge() {
  const total = state.cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById('cartBadge').textContent = total;
}

function loadCart() {
  const container = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');
  if (!container) return;

  if (!state.cart.length) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p><small>Add some delicious food!</small></div>`;
    summary.style.display = 'none';
    return;
  }

  container.innerHTML = state.cart.map(item => {
    const imgHTML = item.img
      ? `<img src="${item.img}" alt="${item.name}" onerror="this.outerHTML='<div class=cart-item-img-ph><i class=fas style=color:#ff6b35 fa-utensils></i></div>'">`
      : `<div class="cart-item-img-ph"><i class="fas fa-utensils" style="color:#ff6b35"></i></div>`;
    return `<div class="cart-item">
      ${imgHTML}
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} each</div>
      </div>
      <div class="cart-item-right">
        <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
        <div class="qty-control">
          <button onclick="changeCartQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeCartQty(${item.id}, 1)">+</button>
        </div>
        <small style="color:#555">₹${item.price * item.qty}</small>
      </div>
    </div>`;
  }).join('');

  const subtotal = cartSubtotal();
  document.getElementById('cartSubtotal').textContent = '₹' + subtotal;
  document.getElementById('cartTotal').textContent = '₹' + (subtotal + 30);
  summary.style.display = 'block';
}

function cartSubtotal() {
  return state.cart.reduce((s, c) => s + c.price * c.qty, 0);
}

function changeCartQty(id, delta) {
  const item = state.cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter(c => c.id !== id);
  saveState(); updateCartBadge(); loadCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(c => c.id !== id);
  saveState(); updateCartBadge(); loadCart();
  showToast('Item removed from cart');
}

// ---------- WISHLIST ----------
function toggleWish(id, btn) {
  const f = state.foods.find(x => x.id === id);
  if (!f) return;
  const idx = state.wishlist.findIndex(w => w.id === id);
  if (idx >= 0) {
    state.wishlist.splice(idx, 1);
    showToast(`${f.name} removed from wishlist`);
    if (btn) btn.classList.remove('active');
  } else {
    state.wishlist.push(f);
    showToast(`${f.name} added to wishlist`);
    if (btn) btn.classList.add('active');
  }
  saveState();
  // Re-render wishlist if on that page
  if (document.getElementById('wishlistGrid')) loadWishlist();
}

function loadWishlist() {
  const grid = document.getElementById('wishlistGrid');
  if (!grid) return;
  if (!state.wishlist.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-heart"></i><p>Your wishlist is empty</p><small>Tap the heart on any food item to save it here</small></div>`;
    return;
  }
  grid.innerHTML = state.wishlist.map(foodCard).join('');
}

// ---------- ORDERS ----------
function loadOrders() {
  const container = document.getElementById('ordersList');
  if (!container) return;
  if (!state.orders.length) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-shopping-bag"></i><p>No orders yet</p><small>Place your first order!</small></div>`;
    return;
  }
  container.innerHTML = state.orders.slice().reverse().map(order => {
    const steps = ['Placed', 'Preparing', 'On the way', 'Delivered'];
    const statusIdx = { placed: 0, preparing: 1, 'on the way': 2, delivered: 3 };
    const current = statusIdx[order.status.toLowerCase()] ?? 0;
    const stepsHTML = steps.map((s, i) => `
      <div class="track-step ${i <= current ? 'done' : ''}">
        <div class="dot"></div><small>${s}</small>
      </div>
      ${i < steps.length - 1 ? `<div class="track-line ${i < current ? 'done' : ''}"></div>` : ''}
    `).join('');
    return `<div class="order-card">
      <div class="order-card-top">
        <span class="order-id">#${order.id}</span>
        <span class="order-status ${order.status.toLowerCase().replace(' ','-')}">${order.status}</span>
      </div>
      <div class="order-items">${order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</div>
      <div class="track-steps">${stepsHTML}</div>
      <div class="order-footer">
        <span>${new Date(order.date).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</span>
        <span class="order-total">₹${order.total} via ${order.payMethod}</span>
      </div>
    </div>`;
  }).join('');
}

// ---------- CHECKOUT / PAYMENT ----------
function openCheckout() {
  if (!state.cart.length) { showToast('Cart is empty!'); return; }

  // Load addresses
  const addrContainer = document.getElementById('checkoutAddress');
  if (!state.addresses.length) {
    addrContainer.innerHTML = `<div class="checkout-addr-item" onclick="closeCheckout();navigateTo('address')"><i class="fas fa-plus"></i> Add a delivery address</div>`;
  } else {
    addrContainer.innerHTML = state.addresses.map((a, i) => `
      <div class="checkout-addr-item ${i === 0 ? 'selected' : ''}" onclick="selectCheckoutAddr(this)">
        <b>${a.type}</b> — ${a.line1}, ${a.line2}, ${a.city}
      </div>`).join('');
  }

  // Summary
  const subtotal = cartSubtotal();
  document.getElementById('coSubtotal').textContent = '₹' + subtotal;
  document.getElementById('coTotal').textContent = '₹' + (subtotal + 30);
  document.getElementById('checkoutSummaryItems').innerHTML = state.cart.map(c =>
    `<div class="summary-row"><span>${c.name} ×${c.qty}</span><span>₹${c.price * c.qty}</span></div>`
  ).join('');

  document.getElementById('checkoutModal').style.display = 'flex';
}

function closeCheckout() {
  document.getElementById('checkoutModal').style.display = 'none';
}

function selectCheckoutAddr(el) {
  document.querySelectorAll('.checkout-addr-item').forEach(a => a.classList.remove('selected'));
  el.classList.add('selected');
}

function selectPayMethod(method, label) {
  state.selectedPayMethod = method;
  document.querySelectorAll('.pay-option').forEach(o => o.classList.remove('active'));
  label.classList.add('active');
  ['upiSection','netbankingSection','cardSection'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  if (method === 'upi') document.getElementById('upiSection').style.display = 'block';
  if (method === 'netbanking') document.getElementById('netbankingSection').style.display = 'block';
  if (method === 'card') document.getElementById('cardSection').style.display = 'block';
}

function selectUPIApp(app, btn) {
  document.querySelectorAll('.upi-app-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function placeOrder() {
  const payMethodMap = { cod: 'Cash on Delivery', upi: 'UPI', netbanking: 'Net Banking', card: 'Card' };
  const order = {
    id: 'FB' + Date.now().toString().slice(-6),
    items: state.cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
    total: cartSubtotal() + 30,
    status: 'Placed',
    payMethod: payMethodMap[state.selectedPayMethod] || state.selectedPayMethod,
    date: new Date().toISOString()
  };
  state.orders.push(order);
  state.cart = [];
  saveState();
  updateCartBadge();
  closeCheckout();
  document.getElementById('successMsg').textContent = `Order #${order.id} placed successfully via ${order.payMethod}!`;
  document.getElementById('orderSuccessModal').style.display = 'flex';
}

function closeSuccess() {
  document.getElementById('orderSuccessModal').style.display = 'none';
  navigateTo('orders');
}

// ---------- PROFILE ----------
function loadProfile() {
  const u = state.user;
  if (!u) return;
  document.getElementById('profileAvatar').textContent = u.name ? u.name[0].toUpperCase() : 'U';
  document.getElementById('profileName').textContent = u.name || '—';
  document.getElementById('profileRole').textContent = u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : '—';
  document.getElementById('profileRole').className = 'role-badge ' + (u.role || 'buyer');
  document.getElementById('profilePhone').textContent = u.phone ? '+91 ' + u.phone : '—';
  document.getElementById('profileEmail').textContent = u.email || '—';
}

function openEditProfile() {
  document.getElementById('editName').value = state.user.name || '';
  document.getElementById('editEmail').value = state.user.email || '';
  document.getElementById('editProfileModal').style.display = 'flex';
}

function closeEditProfile() {
  document.getElementById('editProfileModal').style.display = 'none';
}

function saveProfile() {
  state.user.name = document.getElementById('editName').value.trim() || state.user.name;
  state.user.email = document.getElementById('editEmail').value.trim() || state.user.email;
  saveState();
  updateNavUser();
  loadProfile();
  closeEditProfile();
  showToast('Profile updated!');
}

// ---------- ADDRESS ----------
let currentAddrType = 'Home';
function setAddrType(type, btn) {
  currentAddrType = type;
  document.querySelectorAll('.addr-type').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function openAddAddress() {
  document.getElementById('addAddressModal').style.display = 'flex';
}

function closeAddAddress() {
  document.getElementById('addAddressModal').style.display = 'none';
}

function saveAddress() {
  const line1 = document.getElementById('addrLine1').value.trim();
  const line2 = document.getElementById('addrLine2').value.trim();
  const city = document.getElementById('addrCity').value.trim();
  if (!line1 || !city) { alert('Please fill required fields.'); return; }
  state.addresses.push({ type: currentAddrType, line1, line2, city, id: Date.now() });
  saveState();
  closeAddAddress();
  loadAddresses();
  showToast('Address saved!');
  document.getElementById('navLocation').textContent = city;
}

function loadAddresses() {
  const container = document.getElementById('addressList');
  if (!container) return;
  if (!state.addresses.length) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-map-marker-alt"></i><p>No addresses saved</p><small>Add an address to continue</small></div>`;
    return;
  }
  const icons = { Home: 'fa-home', Work: 'fa-briefcase', Other: 'fa-map-pin' };
  container.innerHTML = state.addresses.map(a => `
    <div class="addr-card">
      <div>
        <div class="addr-type-label"><i class="fas ${icons[a.type] || 'fa-map-pin'}"></i>${a.type}</div>
        <div class="addr-text">${a.line1}${a.line2 ? ', ' + a.line2 : ''}, ${a.city}</div>
      </div>
      <button class="addr-del-btn" onclick="deleteAddress(${a.id})"><i class="fas fa-trash-alt"></i></button>
    </div>`).join('');
}

function deleteAddress(id) {
  state.addresses = state.addresses.filter(a => a.id !== id);
  saveState();
  loadAddresses();
  showToast('Address removed');
}

// ---------- SETTINGS ----------
function toggleDark() {
  document.body.classList.toggle('dark');
  localStorage.setItem('fb_dark', document.body.classList.contains('dark') ? '1' : '0');
}

// Apply dark mode on load
if (localStorage.getItem('fb_dark') === '1') {
  document.body.classList.add('dark');
  const t = document.getElementById('darkToggle');
  if (t) t.checked = true;
}

// ---------- SELLER DASHBOARD ----------
function loadSellerDashboard() {
  const grid = document.getElementById('sellerFoodGrid');
  if (!grid) return;
  const myFoods = state.foods.filter(f => f.seller === state.user.name);
  if (!myFoods.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fas fa-store"></i><p>No listings yet</p><small>Click "Add Food" to list your first item!</small></div>`;
    return;
  }
  grid.innerHTML = myFoods.map(f => {
    const expClass = expiryClass(f.expiry);
    const imgHTML = f.img
      ? `<img src="${f.img}" alt="${f.name}" style="width:100%;height:160px;object-fit:cover" onerror="this.parentElement.innerHTML='<div class=food-card-img-placeholder><i class=fas fa-utensils></i></div>'">`
      : `<div class="food-card-img-placeholder"><i class="fas fa-utensils"></i></div>`;
    return `<div class="food-card">
      ${imgHTML}
      <div class="food-card-body">
        <div class="food-card-top">
          <span class="food-card-name">${f.name}</span>
          <span class="food-card-price">₹${f.price}</span>
        </div>
        <div class="food-card-meta">${f.category} · ⭐${f.rating}</div>
        <div class="food-card-expiry ${expClass}"><i class="fas fa-calendar-check"></i>${expiryLabel(f.expiry)}</div>
        <div class="food-card-actions" style="margin-top:8px">
          <button class="add-cart-btn" style="background:#e74c3c" onclick="deleteFood(${f.id})"><i class="fas fa-trash"></i> Remove</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function openAddFood() {
  state.editingFoodId = null;
  document.getElementById('addFoodTitle').textContent = 'Add Food Listing';
  ['foodName','foodPrice','foodIngredients','foodDesc','foodImg'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('addFoodModal').style.display = 'flex';
}

function closeAddFood() {
  document.getElementById('addFoodModal').style.display = 'none';
}

function saveFood() {
  const name = document.getElementById('foodName').value.trim();
  const price = parseFloat(document.getElementById('foodPrice').value);
  const category = document.getElementById('foodCategory').value;
  const expiry = document.getElementById('foodExpiry').value;
  const ingredients = document.getElementById('foodIngredients').value.trim();
  const description = document.getElementById('foodDesc').value.trim();
  const img = document.getElementById('foodImg').value.trim();

  if (!name || !price || !category) { alert('Please fill name, price and category.'); return; }

  const food = {
    id: Date.now(),
    name, price, category, expiry, ingredients, description,
    img: img || null,
    seller: state.user.name,
    listedOn: new Date().toISOString(),
    rating: 4.0, qty: 50
  };

  state.foods.push(food);
  saveState();
  closeAddFood();
  loadSellerDashboard();
  document.getElementById('statFoods').textContent = state.foods.length;
  showToast(`${name} listed successfully!`);
}

function deleteFood(id) {
  if (!confirm('Remove this listing?')) return;
  state.foods = state.foods.filter(f => f.id !== id);
  saveState();
  loadSellerDashboard();
  showToast('Listing removed');
}

// ---------- TOAST ----------
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
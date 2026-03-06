const SIZE_SURCHARGE = { 'S': 0, 'M': 0, 'L': 0, 'XL': 50, '2XL': 100 };
const ALL_SIZES = ['S', 'M', 'L', 'XL', '2XL'];

const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

const DEFAULT_DETAILS = {
  details: ['Drop shoulder', 'Boxy Cropped Fit', 'Front and back logo print', 'Custom Fit', 'FREE Stickers in every purchase'],
  specs: ['100% COTTON', '260 GSM', 'FRENCH TERRY FABRIC']
};

let allProducts = [
  { id: 1, name: "Uncrowned Signature Shirt", category: "shirts", price: 1200, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772616627489-ca85cae5-e9e3-4104-9c86-eed7f1c1f95a.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 2, name: "Premium Crewneck Shirt", category: "shirts", price: 2800, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772616781321-dc5096d1-b4b1-47e9-9843-07573b357930.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 3, name: "U Cant See Me - Cena Tribute", category: "shirts", price: 4500, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772616833059-bcd3948a-7c37-4d31-97c6-3feba9ee504b.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 4, name: "Premium Crewneck Shirt", category: "shirts", price: 1500, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772616910426-eff84a2f-325c-48fe-b520-2c73db79f33e.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 5, name: "Crewneck Shirt - White", category: "shirts", price: 3200, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772616926529-99357e25-a78d-4036-9c7d-004abb0914fc.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 6, name: "Signature Denim Pants", category: "pants", price: 1500, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772687296130-88262a7a-5fe6-4152-9207-8d2db21469f5.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 7, name: "Baggy Jeans Pants", category: "pants", price: 2500, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772687493366-18a16328-2aca-4f31-b434-68009c34dbda.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 8, name: "Gothic Retro Spider - Baggy Jeans", category: "pants", price: 2100, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772687632857-3958a437-db9d-4a98-8346-7c572adc2de5.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 9, name: "2125 - Divine Sweats", category: "pants", price: 1300, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772687674047-b56301ed-dbde-4bf3-acfc-2bc698bdfd56.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 10, name: "Aonga Y2k Sweatpants", category: "pants", price: 1300, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772687697510-5beab4ad-3b58-4355-a2b3-26b2d3d3d383.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 11, name: "Vielseitige Herbst-Windbreaker Jacket", category: "jackets", price: 1500, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772687951776-b553f020-c392-44ed-bea1-944d2892746c.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 12, name: "POOPMOOM Y2k Jacket", category: "jackets", price: 1000, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772688023426-eb7e157e-eb84-4d55-8935-37d0190a9b7c.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
  { id: 13, name: "Japanese Zip Up Hoodie Patagonia", category: "jackets", price: 1600, sizes: ALL_SIZES, image: "https://image2url.com/r2/default/images/1772688071488-95b3b0fa-ccb6-4313-a409-bff8d0d85ea1.png", details: DEFAULT_DETAILS.details, specs: DEFAULT_DETAILS.specs },
];

let registeredUsers = [];
let cart = [];
let currentUser = null;
let productToDelete = null;

let allOrders = [];

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(allProducts);
  updateAuthUI();
});

function getSurcharge(size) {
  return SIZE_SURCHARGE[size] || 0;
}
function getFinalPrice(basePrice, size) {
  return basePrice + getSurcharge(size);
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  if (products.length === 0) {
    grid.innerHTML = '<p style="color:#888;grid-column:1/-1;padding:40px 0;">No products found.</p>';
    return;
  }
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card product-card-minimal';
    card.onclick = () => openProductDetail(product.id);
    card.innerHTML = `
      <div class="image-container">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="card-hover-overlay"><span>VIEW PRODUCT</span></div>
      </div>
      <div class="product-info">
        <span class="prod-name">${product.name}</span>
        <span class="prod-price">₱${product.price.toLocaleString()}</span>
      </div>
      <div class="product-cat">${product.category.toUpperCase()}</div>
    `;
    grid.appendChild(card);
  });
}

function openProductDetail(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;
  const sizes = (product.sizes && product.sizes.length > 0) ? product.sizes : ALL_SIZES;
  const sizeButtons = sizes.map(s => {
    const surcharge = getSurcharge(s);
    const tag = surcharge > 0 ? `<span class="size-surcharge-detail">+₱${surcharge}</span>` : '';
    return `<button class="detail-size-btn" onclick="selectDetailSize(this,${product.id})" data-size="${s}" data-base="${product.price}">${s}${tag}</button>`;
  }).join('');

  const stockLeft = product.stock != null ? product.stock : null;
  const stockBadge = stockLeft != null
    ? (stockLeft === 0
      ? `<span class="stock-badge out">OUT OF STOCK</span>`
      : stockLeft <= 5
        ? `<span class="stock-badge low">${stockLeft} LEFT</span>`
        : `<span class="stock-badge in">IN STOCK</span>`)
    : '';

  document.getElementById('detail-image').src = product.image;
  document.getElementById('detail-name').innerText = product.name;
  document.getElementById('detail-cat').innerText = product.category.toUpperCase();
  document.getElementById('detail-price').innerHTML = `₱${product.price.toLocaleString()}`;
  document.getElementById('detail-stock-badge').innerHTML = stockBadge;
  document.getElementById('detail-sizes').innerHTML = sizeButtons;
  document.getElementById('detail-size-error').style.display = 'none';
  document.getElementById('detail-add-btn').onclick = () => addToCartFromDetail(product.id);
  document.getElementById('detail-product-id').value = product.id;

  const details = product.details && product.details.length ? product.details : [];
  const specs = product.specs && product.specs.length ? product.specs : [];
  const detailEl = document.getElementById('detail-description');
  if (detailEl) {
    detailEl.innerHTML = `
      ${details.length ? `<div class="detail-desc-section"><div class="detail-desc-title">DETAILS</div>${details.map(d => `<div class="detail-desc-line">${d}</div>`).join('')}</div>` : ''}
      ${specs.length ? `<div class="detail-desc-section"><div class="detail-desc-title">SPEC</div>${specs.map(s => `<div class="detail-desc-line">${s}</div>`).join('')}</div>` : ''}
    `;
  }
  openModal('product-detail-modal');
}

function selectDetailSize(btn, productId) {
  document.querySelectorAll('.detail-size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const product = allProducts.find(p => p.id === productId);
  const surcharge = getSurcharge(btn.dataset.size);
  const finalPrice = product.price + surcharge;
  document.getElementById('detail-price').innerHTML = surcharge > 0
    ? `₱${finalPrice.toLocaleString()} <span style="font-size:0.8rem;color:#888;font-weight:400;">incl. +₱${surcharge} for ${btn.dataset.size}</span>`
    : `₱${finalPrice.toLocaleString()}`;
  document.getElementById('detail-size-error').style.display = 'none';
}

function addToCartFromDetail(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;
  if (product.stock != null && product.stock <= 0) return showToast('Sorry, this item is out of stock.');
  const selectedBtn = document.querySelector('.detail-size-btn.selected');
  if (!selectedBtn) {
    document.getElementById('detail-size-error').style.display = 'block';
    return;
  }
  const size = selectedBtn.dataset.size;
  const finalPrice = getFinalPrice(product.price, size);
  const existing = cart.find(i => i.id === id && i.size === size);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
    existing.finalPrice = finalPrice;
  } else {
    cart.push({ ...product, size, finalPrice, qty: 1 });
  }
  if (product.stock != null) product.stock = Math.max(0, product.stock - 1);
  updateCartUI();
  closeModal('product-detail-modal');
  document.getElementById('cart-modal').classList.add('active');
  document.getElementById('overlay').style.display = 'block';
  showToast(`${product.name} (${size}) added to bag!`);
}

function selectSize(btn, productId) {
  document.querySelectorAll(`#sizes-${productId} .size-btn`).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  const basePrice = parseInt(btn.dataset.base);
  const surcharge = getSurcharge(btn.dataset.size);
  const finalPrice = basePrice + surcharge;
  const priceEl = document.getElementById(`price-display-${productId}`);
  if (priceEl) {
    priceEl.innerHTML = surcharge > 0
      ? `₱${finalPrice.toLocaleString()} <span class="price-surcharge-tag">incl. +₱${surcharge} for ${btn.dataset.size}</span>`
      : `₱${finalPrice.toLocaleString()}`;
  }
  const err = document.getElementById(`size-err-${productId}`);
  if (err) err.style.display = 'none';
}

function filterProducts(category) {
  if (category === 'all') renderProducts(allProducts);
  else renderProducts(allProducts.filter(p => p.category === category));
}

function toggleCart() {
  const cartModal = document.getElementById('cart-modal');
  const overlay = document.getElementById('overlay');
  const isActive = cartModal.classList.toggle('active');
  overlay.style.display = isActive ? 'block' : 'none';
}

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;
  const selectedBtn = document.querySelector(`#sizes-${id} .size-btn.selected`);
  if (!selectedBtn) {
    const err = document.getElementById(`size-err-${id}`);
    if (err) { err.style.display = 'block'; err.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    return;
  }
  const size = selectedBtn.dataset.size;
  const finalPrice = getFinalPrice(product.price, size);
  const existing = cart.find(i => i.id === id && i.size === size);
  if (existing) { existing.qty = (existing.qty || 1) + 1; }
  else { cart.push({ ...product, size, finalPrice, qty: 1 }); }
  updateCartUI();
  document.getElementById('cart-modal').classList.add('active');
  document.getElementById('overlay').style.display = 'block';
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + (i.qty || 1), 0);
  document.getElementById('cart-count').innerText = totalItems;
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    const qty = item.qty || 1;
    total += item.finalPrice * qty;
    const surcharge = getSurcharge(item.size);
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1;min-width:0;">
        <h4 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</h4>
        <p style="font-size:0.78rem;color:#888;margin:2px 0;">Size: <strong>${item.size}</strong>${surcharge > 0 ? ` · +₱${surcharge}` : ''}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;gap:8px;">
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty(${index},-1)">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn" onclick="changeQty(${index},1)">+</button>
          </div>
          <span style="font-weight:700;font-size:0.92rem;">₱${(item.finalPrice * qty).toLocaleString()}</span>
        </div>
        <button onclick="removeFromCart(${index})" class="cart-remove-btn">🗑 Remove</button>
      </div>
    `;
    container.appendChild(div);
  });
  document.getElementById('cart-total').innerText = `₱${total.toLocaleString()}`;
}

function changeQty(index, delta) {
  const item = cart[index];
  if (!item) return;
  const newQty = (item.qty || 1) + delta;
  if (newQty <= 0) { cart.splice(index, 1); }
  else { item.qty = newQty; }
  updateCartUI();
}

function checkout() {
  if (cart.length === 0) return showToast('Your bag is empty.');
  if (!currentUser) {
    document.getElementById('cart-modal').classList.remove('active');
    document.getElementById('overlay').style.display = 'none';
    showToast('Please log in to checkout.');
    setTimeout(() => openModal('login-modal'), 400);
    return;
  }
  document.getElementById('cart-modal').classList.remove('active');
  openCheckout();
}

let selectedPayMethod = 'card';
let currentStep = 1;

function openCheckout() {
  goToStep(1, true);
  selectedPayMethod = 'card';
  selectPayMethod('card');
  prefillSavedAddress();
  openModal('checkout-modal');
}

function goToStep(step, silent) {
  if (!silent && step > currentStep) {
    if (currentStep === 1 && !validateAddress()) return;
    if (currentStep === 2 && !validatePayment()) return;
  }
  if (step === 3 && !silent) {
    if (selectedPayMethod === 'gcash') {
      launchGCashRedirect();
      return;
    }
    buildReviewPanel();
  }
  document.querySelectorAll('.checkout-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('checkout-step-' + step).classList.add('active');
  currentStep = step;
  updateStepIndicator(step);
}

function updateStepIndicator(step) {
  for (let i = 1; i <= 3; i++) {
    const circle = document.getElementById('step-circle-' + i);
    const label = document.getElementById('step-label-' + i);
    circle.classList.remove('active', 'done');
    label.classList.remove('active', 'done');
    if (i < step) { circle.classList.add('done'); label.classList.add('done'); circle.innerText = '✓'; }
    else if (i === step) { circle.classList.add('active'); label.classList.add('active'); circle.innerText = i; }
    else { circle.innerText = i; }
  }
  const line1 = document.getElementById('step-line-1');
  const line2 = document.getElementById('step-line-2');
  if (line1) line1.classList.toggle('done', step > 1);
  if (line2) line2.classList.toggle('done', step > 2);
}

function validateAddress() {
  const fname = document.getElementById('addr-fname').value.trim();
  const lname = document.getElementById('addr-lname').value.trim();
  const phone = document.getElementById('addr-phone').value.trim();
  const street = document.getElementById('addr-street').value.trim();
  const city = document.getElementById('addr-city').value.trim();
  const province = document.getElementById('addr-province').value.trim();
  const zip = document.getElementById('addr-zip').value.trim();
  const region = document.getElementById('addr-region').value;
  const err = document.getElementById('address-error');
  if (!fname || !lname) return showCheckError(err, 'Please enter your full name.');
  if (!phone || phone.length !== 11) return showCheckError(err, 'Please enter a valid 11-digit phone number.');
  if (!street) return showCheckError(err, 'Please enter your street address.');
  if (!city) return showCheckError(err, 'Please enter your city.');
  if (!province) return showCheckError(err, 'Please enter your province.');
  if (!zip) return showCheckError(err, 'Please enter your ZIP code.');
  if (!region) return showCheckError(err, 'Please select your region.');
  err.style.display = 'none';
  return true;
}

function validatePayment() {
  const err = document.getElementById('payment-error');
  if (selectedPayMethod === 'card') {
    const num = document.getElementById('card-number').value.replace(/\s/g, '');
    const name = document.getElementById('card-name').value.trim();
    const expiry = document.getElementById('card-expiry').value.trim();
    const cvv = document.getElementById('card-cvv').value.trim();
    if (num.length < 16) return showCheckError(err, 'Please enter a valid 16-digit card number.');
    if (!name) return showCheckError(err, 'Please enter the cardholder name.');
    if (expiry.length < 5) return showCheckError(err, 'Please enter a valid expiry date (MM/YY).');
    if (cvv.length < 3) return showCheckError(err, 'Please enter a valid CVV.');
  } else if (selectedPayMethod === 'gcash') {
    const num = document.getElementById('gcash-number').value.trim();
    if (!num) return showCheckError(err, 'Please enter your GCash number.');
  }
  err.style.display = 'none';
  return true;
}

function showCheckError(el, msg) { el.innerText = msg; el.style.display = 'block'; return false; }

function buildReviewPanel() {
  const subtotal = cart.reduce((s, i) => s + i.finalPrice * (i.qty || 1), 0);
  const shipping = 150;
  const total = subtotal + shipping;
  const itemsEl = document.getElementById('review-items');
  itemsEl.innerHTML = '';
  cart.forEach(item => {
    const surcharge = getSurcharge(item.size);
    const d = document.createElement('div');
    d.className = 'summary-item';
    d.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="summary-item-info">
        <strong>${item.name}</strong>
        <small>${item.category.toUpperCase()} · Size: <strong>${item.size}</strong>${surcharge > 0 ? ` (+₱${surcharge})` : ''}</small>
      </div>
      <div class="summary-item-price">₱${item.finalPrice.toLocaleString()}</div>
    `;
    itemsEl.appendChild(d);
  });
  document.getElementById('review-subtotal').innerText = `₱${subtotal.toLocaleString()}`;
  document.getElementById('review-shipping').innerText = `₱${shipping.toLocaleString()}`;
  document.getElementById('review-total').innerText = `₱${total.toLocaleString()}`;

  const fname = document.getElementById('addr-fname').value.trim();
  const lname = document.getElementById('addr-lname').value.trim();
  const phone = document.getElementById('addr-phone').value.trim();
  const street = document.getElementById('addr-street').value.trim();
  const city = document.getElementById('addr-city').value.trim();
  const province = document.getElementById('addr-province').value.trim();
  const zip = document.getElementById('addr-zip').value.trim();
  const region = document.getElementById('addr-region').value;
  document.getElementById('review-address').innerHTML =
    `<strong>${fname} ${lname}</strong><br>${phone}<br>${street}<br>${city}, ${province} ${zip}<br>${region}`;

  let payHTML = '';
  if (selectedPayMethod === 'card') {
    const rawNum = document.getElementById('card-number').value.replace(/\s/g, '');
    const masked = '•••• •••• •••• ' + rawNum.slice(-4);
    const cname = document.getElementById('card-name').value.trim();
    const expiry = document.getElementById('card-expiry').value.trim();
    payHTML = `💳 <strong>Credit / Debit Card</strong><br>${masked}<br>${cname} · Exp: ${expiry}`;
  } else if (selectedPayMethod === 'gcash') {
    payHTML = `📱 <strong>GCash</strong><br>${document.getElementById('gcash-number').value.trim()}`;
  } else {
    payHTML = `💵 <strong>Cash on Delivery</strong><br>Pay when your order arrives.`;
  }
  document.getElementById('review-payment').innerHTML = payHTML;
}

function placeOrder(gcashMeta) {
  const subtotal = cart.reduce((s, i) => s + i.finalPrice * (i.qty || 1), 0);
  const shipping = 150;
  const total = subtotal + shipping;
  const orderNum = 'UL-' + Math.random().toString(36).substr(2, 6).toUpperCase();

  const addrSrc = (gcashMeta && gcashMeta.address) ? gcashMeta.address : {
    fname: document.getElementById('addr-fname').value.trim(),
    lname: document.getElementById('addr-lname').value.trim(),
    phone: document.getElementById('addr-phone').value.trim(),
    street: document.getElementById('addr-street').value.trim(),
    city: document.getElementById('addr-city').value.trim(),
    province: document.getElementById('addr-province').value.trim(),
    zip: document.getElementById('addr-zip').value.trim(),
    region: document.getElementById('addr-region').value,
  };
  const { fname, lname, phone, street, city, province, zip, region } = addrSrc;
  saveAddressToStorage(addrSrc);

  const order = {
    orderNum,
    customer: currentUser.username,
    items: cart.map(i => ({ name: i.name, size: i.size, qty: i.qty || 1, price: i.finalPrice, image: i.image })),
    subtotal, shipping, total,
    address: { name: `${fname} ${lname}`, phone, street, city, province, zip, region },
    payment: selectedPayMethod,
    status: 'pending',
    gcashProof: gcashMeta ? gcashMeta.gcashProof : null,
    gcashRef: gcashMeta ? gcashMeta.gcashRef : null,
    gcashStatus: gcashMeta ? gcashMeta.gcashStatus : null,
    createdAt: new Date().toISOString()
  };
  allOrders.unshift(order);

  document.getElementById('success-order-num').innerText = 'ORDER #' + orderNum;
  document.querySelectorAll('.checkout-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('checkout-success').classList.add('active');
  cart = [];
  updateCartUI();
  updateStepIndicator(4);
}

function selectPayMethod(method) {
  selectedPayMethod = method;
  ['card', 'gcash', 'cod'].forEach(m => {
    document.getElementById('pm-' + m).classList.toggle('selected', m === method);
    document.getElementById('pay-panel-' + m).classList.toggle('active', m === method);
  });
}

function formatCardNumber(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
  input.value = v;
}
function updateCardPreview() {
  const num = document.getElementById('card-number').value || '•••• •••• •••• ••••';
  const name = document.getElementById('card-name').value.toUpperCase() || 'YOUR NAME';
  const exp = document.getElementById('card-expiry').value || 'MM/YY';
  document.getElementById('card-num-display').innerText = num;
  document.getElementById('card-name-display').innerText = name;
  document.getElementById('card-exp-display').innerText = exp;
}

function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.getElementById('overlay').style.display = 'block';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  const anyOpen = document.querySelector('.modal.active');
  const cartOpen = document.getElementById('cart-modal').classList.contains('active');
  if (!anyOpen && !cartOpen) document.getElementById('overlay').style.display = 'none';
}
function closeAllModals() {
  document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  document.getElementById('cart-modal').classList.remove('active');
  document.getElementById('overlay').style.display = 'none';
}
function switchModal(fromId, toId) {
  document.getElementById(fromId).classList.remove('active');
  document.getElementById(toId).classList.add('active');
}
function showError(id, msg) {
  const el = document.getElementById(id);
  el.innerText = msg; el.style.display = 'block';
}
function hideError(id) { document.getElementById(id).style.display = 'none'; }
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast'; toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
}

function signup() {
  hideError('signup-error');
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const ageVal = document.getElementById('signup-age').value.trim();
  const password = document.getElementById('signup-password').value;
  const agreedTerms = document.getElementById('agree-terms').checked;
  const agreedPrivacy = document.getElementById('agree-privacy').checked;

  if (!username) return showError('signup-error', 'Username is required.');
  if (!email) return showError('signup-error', 'Email is required.');
  if (!ageVal) return showError('signup-error', 'Age is required.');
  const age = parseInt(ageVal);
  if (isNaN(age) || age < 1 || age > 120) return showError('signup-error', 'Please enter a valid age.');
  if (age < 18) return showError('signup-error', '⚠️ You must be 18 or older to register.');
  if (!password) return showError('signup-error', 'Password is required.');
  const pwStrength = checkPasswordStrength(password);
  if (pwStrength.score < 4) return showError('signup-error', '⚠ ' + pwStrength.tip);
  if (!agreedTerms) return showError('signup-error', 'Please agree to the Terms & Conditions.');
  if (!agreedPrivacy) return showError('signup-error', 'Please agree to the Privacy Policy.');
  if (registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return showError('signup-error', 'This email is already registered.');

  const newUser = { id: registeredUsers.length + 1, username, email, password, age, role: 'customer', createdAt: new Date() };
  registeredUsers.push(newUser);
  ['signup-username', 'signup-email', 'signup-age', 'signup-password'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('agree-terms').checked = false;
  document.getElementById('agree-privacy').checked = false;
  document.getElementById('signup-strength-bar').style.width = '0%';
  document.getElementById('signup-strength-label').innerText = '';
  switchModal('signup-modal', 'login-modal');
  showToast('Account created! Please log in.');
}

function login() {
  hideError('login-error');
  const emailOrUser = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!emailOrUser) return showError('login-error', 'Please enter your email or username.');
  if (!password) return showError('login-error', 'Please enter your password.');

  if ((emailOrUser === ADMIN_CREDENTIALS.username || emailOrUser === 'admin') && password === ADMIN_CREDENTIALS.password) {
    currentUser = { username: 'Admin', role: 'admin' };
    updateAuthUI(); closeModal('login-modal');
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    showToast('Welcome back, Admin!'); return;
  }
  const user = registeredUsers.find(u =>
    (u.email.toLowerCase() === emailOrUser.toLowerCase() || u.username.toLowerCase() === emailOrUser.toLowerCase())
    && u.password === password
  );
  if (!user) return showError('login-error', 'Invalid email/username or password.');
  currentUser = { username: user.username, role: user.role };
  updateAuthUI(); closeModal('login-modal');
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  showToast(`Welcome back, ${user.username}!`);
}

function logout() {
  currentUser = null;
  updateAuthUI();
  showToast('Logged out successfully.');
}

function updateAuthUI() {
  if (currentUser) {
    document.getElementById('auth-area').style.display = 'none';
    document.getElementById('user-area').style.display = 'flex';
    document.getElementById('user-greeting').innerText = `HI, ${currentUser.username.toUpperCase()}`;
    const isAdmin = currentUser.role === 'admin';
    document.getElementById('admin-btn').style.display = isAdmin ? 'inline-block' : 'none';
    document.getElementById('my-orders-btn').style.display = isAdmin ? 'none' : 'inline-block';
    document.getElementById('my-address-btn').style.display = isAdmin ? 'none' : 'inline-block';
  } else {
    document.getElementById('auth-area').style.display = 'flex';
    document.getElementById('user-area').style.display = 'none';
  }
}

function openAdminPanel() {
  openModal('admin-modal');
  switchAdminTab('products');
}

function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach((t, i) => {
    t.classList.toggle('active',
      (tab === 'products' && i === 0) ||
      (tab === 'users' && i === 1) ||
      (tab === 'orders' && i === 2)
    );
  });
  document.getElementById('admin-products').style.display = tab === 'products' ? 'block' : 'none';
  document.getElementById('admin-users').style.display = tab === 'users' ? 'block' : 'none';
  document.getElementById('admin-orders').style.display = tab === 'orders' ? 'block' : 'none';
  if (tab === 'products') loadAdminProducts();
  else if (tab === 'users') loadAdminUsers();
  else if (tab === 'orders') loadAdminOrders();
}

function loadAdminProducts() {
  const list = document.getElementById('admin-product-list');
  list.innerHTML = '';
  const countEl = document.getElementById('product-count');
  if (countEl) countEl.innerText = allProducts.length;
  if (allProducts.length === 0) {
    list.innerHTML = '<p style="color:#888;padding:20px 0;">No products. Click "+ ADD PRODUCT".</p>';
    return;
  }
  allProducts.forEach(p => {
    const row = document.createElement('div');
    row.className = 'admin-row';
    const stockTxt = p.stock != null
      ? (p.stock === 0
        ? `<span style="color:#c0392b;font-weight:700;font-size:0.75rem;">OUT OF STOCK</span>`
        : `<span style="color:${p.stock <= 5 ? '#e67e22' : '#27ae60'};font-weight:700;font-size:0.75rem;">${p.stock} in stock</span>`)
      : `<span style="color:#aaa;font-size:0.75rem;">Stock not set</span>`;
    row.innerHTML = `
      <img src="${p.image}" alt="${p.name}" style="width:50px;height:60px;object-fit:cover;flex-shrink:0;">
      <div style="flex:1;min-width:0;">
        <strong style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</strong>
        <small style="color:#888;">${p.category.toUpperCase()} — ₱${p.price.toLocaleString()}</small>
        <div style="margin-top:2px;">${stockTxt}</div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0;align-items:center;">
        <button class="edit-btn" onclick="openAddProduct(${p.id})">EDIT</button>
        <button class="delete-btn trash-btn" onclick="promptDelete(${p.id},'${p.name.replace(/'/g, "\\'")}')">🗑</button>
      </div>
    `;
    list.appendChild(row);
  });
}

function loadAdminUsers() {
  const list = document.getElementById('admin-user-list');
  list.innerHTML = '';
  if (registeredUsers.length === 0) {
    list.innerHTML = '<p style="color:#888;padding:20px 0;">No registered customers yet.</p>';
    return;
  }
  registeredUsers.forEach(u => {
    const row = document.createElement('div');
    row.className = 'admin-row';
    row.innerHTML = `
      <div style="flex:1;">
        <strong>${u.username}</strong>
        <small style="display:block;color:#888;">${u.email} · Age: ${u.age}</small>
        <small style="display:block;color:#aaa;">Joined: ${new Date(u.createdAt).toLocaleDateString()}</small>
      </div>
    `;
    list.appendChild(row);
  });
}

function loadAdminOrders() {
  const list = document.getElementById('admin-order-list');
  const countEl = document.getElementById('order-count');
  list.innerHTML = '';
  if (countEl) countEl.innerText = allOrders.length;
  if (allOrders.length === 0) {
    list.innerHTML = '<p style="color:#888;padding:20px 0;">No orders yet.</p>';
    return;
  }
  allOrders.forEach((order, idx) => {
    const statusColors = { pending: '#e67e22', out_for_delivery: '#2980b9', completed: '#27ae60', cancelled: '#c0392b' };
    const statusLabels = { pending: '⏳ Pending', out_for_delivery: '🚚 Out for Delivery', completed: '✅ Completed', cancelled: '❌ Cancelled' };
    const color = statusColors[order.status] || '#888';
    const label = statusLabels[order.status] || order.status;
    const date = new Date(order.createdAt).toLocaleString();
    const itemsSummary = order.items.map(i => `${i.name} (${i.size})`).join(', ');

    const isGCash = order.payment === 'gcash';
    const gcashPending = isGCash && order.gcashStatus === 'pending_confirmation';
    const gcashConfirmed = isGCash && order.gcashStatus === 'confirmed';
    const gcashRejected = isGCash && order.gcashStatus === 'rejected';

    const row = document.createElement('div');
    row.className = 'admin-order-row';
    row.innerHTML = `
      <div class="order-row-top">
        <div>
          <strong class="order-num">#${order.orderNum}</strong>
          <span class="order-customer">by ${order.customer}</span>
          <span class="order-date">${date}</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          ${gcashPending ? `<span class="gcash-badge pending">⏳ AWAITING VERIFICATION</span>` : ''}
          ${gcashConfirmed ? `<span class="gcash-badge confirmed">💙 GCASH CONFIRMED</span>` : ''}
          ${gcashRejected ? `<span class="gcash-badge rejected">❌ PAYMENT REJECTED</span>` : ''}
          <span class="order-status-badge" style="background:${color};">${label}</span>
        </div>
      </div>
      <div class="order-row-items">${itemsSummary}</div>
      <div class="order-row-address">📍 ${order.address.street}, ${order.address.city}, ${order.address.province} ${order.address.zip} · ${order.address.phone}</div>
      ${isGCash && order.gcashRef ? `
        <div class="gcash-proof-row">
          <div class="gcash-ref-display">📋 Ref #: <strong>${order.gcashRef}</strong></div>
          ${order.gcashProof ? `<img src="${order.gcashProof}" class="gcash-proof-thumb" onclick="viewGCashProof(${idx})" title="Click to enlarge">` : ''}
          ${gcashPending ? `
            <div style="display:flex;gap:8px;flex-shrink:0;">
              <button class="order-btn gcash-confirm-btn" onclick="confirmGCashPaymentAdmin(${idx})">✅ CONFIRM</button>
              <button class="order-btn gcash-reject-btn"  onclick="rejectGCashPaymentAdmin(${idx})">❌ REJECT</button>
            </div>
          ` : ''}
          ${gcashRejected ? `<span style="font-size:0.75rem;color:#c0392b;font-weight:700;">Reason: ${order.gcashRejectReason || 'Invalid payment proof'}</span>` : ''}
        </div>
      ` : ''}
      <div class="order-row-bottom">
        <span class="order-total">Total: <strong>₱${order.total.toLocaleString()}</strong> · ${order.payment.toUpperCase()}</span>
        <div class="order-actions">
          ${(order.status === 'pending' && (!isGCash || gcashConfirmed)) ? `<button class="order-btn deliver" onclick="updateOrderStatus(${idx},'out_for_delivery')">🚚 Mark Out for Delivery</button>` : ''}
          ${order.status === 'out_for_delivery' ? `<button class="order-btn complete" onclick="updateOrderStatus(${idx},'completed')">✅ Mark Completed</button>` : ''}
          ${order.status === 'completed' ? `<span style="color:#27ae60;font-weight:700;font-size:0.8rem;">✅ Delivered</span>` : ''}
          ${order.status !== 'completed' && order.status !== 'cancelled' ? `<button class="order-btn cancel" onclick="updateOrderStatus(${idx},'cancelled')">Cancel</button>` : ''}
        </div>
      </div>
    `;
    list.appendChild(row);
  });
}

function updateOrderStatus(idx, newStatus) {
  allOrders[idx].status = newStatus;
  loadAdminOrders();
  const labels = { out_for_delivery: 'Out for Delivery', completed: 'Completed', cancelled: 'Cancelled' };
  showToast(`Order #${allOrders[idx].orderNum} → ${labels[newStatus]}`);
}

function confirmGCashPaymentAdmin(idx) {
  allOrders[idx].gcashStatus = 'confirmed';
  loadAdminOrders();
  showToast(`💙 GCash payment confirmed for Order #${allOrders[idx].orderNum}`);
}

let gcashRejectTargetIdx = null;

function rejectGCashPaymentAdmin(idx) {
  gcashRejectTargetIdx = idx;
  document.getElementById('gcash-reject-reason').value = '';
  document.querySelectorAll('.reject-reason-chip').forEach(c => c.classList.remove('selected'));
  openModal('gcash-reject-modal');
}

function selectRejectReason(chip, text) {
  document.querySelectorAll('.reject-reason-chip').forEach(c => c.classList.remove('selected'));
  chip.classList.add('selected');
  document.getElementById('gcash-reject-reason').value = text;
}

function confirmGCashReject() {
  const reason = document.getElementById('gcash-reject-reason').value.trim();
  if (!reason) { showToast('Please select or type a reason.'); return; }
  const idx = gcashRejectTargetIdx;
  allOrders[idx].gcashStatus = 'rejected';
  allOrders[idx].gcashRejectReason = reason;
  allOrders[idx].status = 'cancelled';
  closeModal('gcash-reject-modal');
  loadAdminOrders();
  showToast(`❌ GCash payment rejected for Order #${allOrders[idx].orderNum}`);
}

function viewGCashProof(idx) {
  const order = allOrders[idx];
  if (!order || !order.gcashProof) return;
  const win = window.open('');
  win.document.write(`<html><body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;"><img src="${order.gcashProof}" style="max-width:100%;max-height:100vh;object-fit:contain;"></body></html>`);
}

function promptDelete(id, name) {
  productToDelete = id;
  document.getElementById('delete-product-name').innerText = name;
  openModal('delete-modal');
}
function confirmDelete() {
  if (productToDelete === null) return;
  allProducts = allProducts.filter(p => p.id !== productToDelete);
  productToDelete = null;
  closeModal('delete-modal');
  renderProducts(allProducts);
  loadAdminProducts();
  showToast('Product deleted successfully.');
}

let editingProductId = null;
function openAddProduct(id) {
  editingProductId = id || null;
  hideError('add-product-error');
  document.querySelectorAll('.size-checkbox').forEach(cb => cb.checked = false);
  if (id) {
    const p = allProducts.find(p => p.id === id);
    document.getElementById('add-product-title').innerText = 'EDIT PRODUCT';
    document.getElementById('new-product-image').value = p.image;
    document.getElementById('new-product-name').value = p.name;
    document.getElementById('new-product-category').value = p.category;
    document.getElementById('new-product-price').value = p.price;
    document.getElementById('new-product-stock').value = p.stock != null ? p.stock : '';
    document.getElementById('new-product-details').value = p.details ? p.details.join('\n') : '';
    document.getElementById('new-product-specs').value = p.specs ? p.specs.join('\n') : '';
    const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : ALL_SIZES;
    sizes.forEach(s => {
      const cb = document.querySelector(`.size-checkbox[data-size="${s}"]`);
      if (cb) cb.checked = true;
    });
    previewImage();
  } else {
    document.getElementById('add-product-title').innerText = 'ADD PRODUCT';
    document.getElementById('new-product-image').value = '';
    document.getElementById('new-product-name').value = '';
    document.getElementById('new-product-category').value = '';
    document.getElementById('new-product-price').value = '';
    document.getElementById('new-product-stock').value = '';
    document.getElementById('new-product-details').value = '';
    document.getElementById('new-product-specs').value = '';
    document.getElementById('img-preview-img').style.display = 'none';
    document.getElementById('img-placeholder').style.display = 'block';
    document.getElementById('img-placeholder').innerText = 'IMAGE PREVIEW';
    document.querySelectorAll('.size-checkbox').forEach(cb => cb.checked = true);
  }
  openModal('add-product-modal');
}

function previewImage() {
  const url = document.getElementById('new-product-image').value.trim();
  const img = document.getElementById('img-preview-img');
  const ph = document.getElementById('img-placeholder');
  if (url) {
    img.src = url;
    img.onload = () => { img.style.display = 'block'; ph.style.display = 'none'; };
    img.onerror = () => { img.style.display = 'none'; ph.style.display = 'block'; ph.innerText = '⚠ Invalid image URL'; };
  } else {
    img.style.display = 'none'; ph.style.display = 'block'; ph.innerText = 'IMAGE PREVIEW';
  }
}

function saveProduct() {
  const image = document.getElementById('new-product-image').value.trim();
  const name = document.getElementById('new-product-name').value.trim();
  const category = document.getElementById('new-product-category').value;
  const priceVal = document.getElementById('new-product-price').value;
  const stockVal = document.getElementById('new-product-stock').value;
  const sizes = [...document.querySelectorAll('.size-checkbox:checked')].map(cb => cb.dataset.size);

  if (!image) return showError('add-product-error', 'Please enter an image URL.');
  if (!name) return showError('add-product-error', 'Please enter a product name.');
  if (!category) return showError('add-product-error', 'Please select a category.');
  if (!priceVal || parseInt(priceVal) < 1) return showError('add-product-error', 'Please enter a valid price.');
  if (sizes.length === 0) return showError('add-product-error', 'Please select at least one available size.');
  document.getElementById('add-product-error').style.display = 'none';

  const price = parseInt(priceVal);
  const stock = stockVal !== '' ? parseInt(stockVal) : null;
  const details = document.getElementById('new-product-details').value.trim().split('\n').map(s => s.trim()).filter(Boolean);
  const specs = document.getElementById('new-product-specs').value.trim().split('\n').map(s => s.trim()).filter(Boolean);
  if (editingProductId !== null) {
    const idx = allProducts.findIndex(p => p.id === editingProductId);
    if (idx > -1) allProducts[idx] = { ...allProducts[idx], image, name, category, price, sizes, stock, details, specs };
    showToast(`"${name}" updated successfully.`);
  } else {
    const newId = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.id)) + 1 : 1;
    allProducts.push({ id: newId, name, category, price, image, sizes, stock, details, specs });
    showToast(`"${name}" added to the store!`);
  }
  closeModal('add-product-modal');
  renderProducts(allProducts);
  loadAdminProducts();
}

function getCustomerTab(order) {
  if (order.status === 'cancelled') return null;
  if (order.status === 'pending') {
    return order.payment === 'cod' ? 'to_ship' : 'to_pay';
  }
  if (order.status === 'out_for_delivery') return 'to_receive';
  if (order.status === 'completed') return order.rated ? null : 'to_rate';
  return null;
}

let currentMyOrdersTab = 'to_pay';
let ratingTargetOrderNum = null;
let currentRating = 0;

function openMyOrders() {
  refreshMyOrdersBadges();
  switchMyOrdersTab('to_pay');
  openModal('my-orders-modal');
}

function refreshMyOrdersBadges() {
  const tabs = ['to_pay', 'to_ship', 'to_receive', 'to_rate'];
  const counts = { to_pay: 0, to_ship: 0, to_receive: 0, to_rate: 0 };
  const myOrders = allOrders.filter(o => o.customer === currentUser?.username);
  myOrders.forEach(o => {
    const tab = getCustomerTab(o);
    if (tab) counts[tab]++;
  });
  tabs.forEach(tab => {
    const el = document.getElementById('badge-' + tab);
    if (!el) return;
    el.innerText = counts[tab];
    el.classList.toggle('visible', counts[tab] > 0);
  });
}

function switchMyOrdersTab(tab) {
  currentMyOrdersTab = tab;
  document.querySelectorAll('.my-orders-tab').forEach((t, i) => {
    const tabs = ['to_pay', 'to_ship', 'to_receive', 'to_rate'];
    t.classList.toggle('active', tabs[i] === tab);
  });
  renderMyOrders(tab);
}

function renderMyOrders(tab) {
  const list = document.getElementById('my-orders-list');
  list.innerHTML = '';
  const myOrders = allOrders.filter(o => o.customer === currentUser?.username && getCustomerTab(o) === tab);

  if (myOrders.length === 0) {
    const emptyIcons = { to_pay: '💳', to_ship: '📦', to_receive: '🚚', to_rate: '⭐' };
    const emptyMsgs = {
      to_pay: 'No orders waiting for payment.',
      to_ship: 'No orders being prepared.',
      to_receive: 'No orders out for delivery.',
      to_rate: 'No completed orders to rate yet.'
    };
    list.innerHTML = `
      <div class="my-order-empty">
        <div class="empty-icon">${emptyIcons[tab]}</div>
        <p>${emptyMsgs[tab]}</p>
      </div>`;
    return;
  }

  myOrders.forEach(order => {
    const statusColors = {
      pending: '#e67e22',
      out_for_delivery: '#2980b9',
      completed: '#27ae60',
    };
    const statusLabels = {
      pending: order.payment === 'cod' ? '📦 Preparing' : (order.payment === 'gcash' ? '💙 GCash - Verifying Payment' : '💳 Awaiting Payment'),
      out_for_delivery: '🚚 Out for Delivery',
      completed: '✅ Delivered',
    };
    const color = statusColors[order.status] || '#888';
    const label = statusLabels[order.status] || order.status;
    const date = new Date(order.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });

    const itemsHTML = order.items.map(item => `
      <div class="my-order-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="my-order-item-info">
          <strong>${item.name}</strong>
          <small>Size: ${item.size}</small>
        </div>
        <div class="my-order-item-price">₱${item.price.toLocaleString()}</div>
      </div>
    `).join('');


    let actionBtn = '';
    if (tab === 'to_pay') {
      if (order.payment === 'gcash') {
        if (order.gcashStatus === 'pending_confirmation') {
          actionBtn = `<span style="font-size:0.75rem;font-weight:700;color:#e67e22;background:#fff8f0;border:1px solid #f5cba7;padding:6px 12px;border-radius:4px;">⏳ Waiting for admin to verify payment</span>`;
        } else if (order.gcashStatus === 'confirmed') {
          actionBtn = `<span style="font-size:0.75rem;font-weight:700;color:#27ae60;background:#f0fff4;border:1px solid #a9dfbf;padding:6px 12px;border-radius:4px;">💙 GCash Confirmed</span>`;
        } else if (order.gcashStatus === 'rejected') {
          actionBtn = `<div style="text-align:right;"><span style="font-size:0.75rem;font-weight:700;color:#c0392b;background:#fdecea;border:1px solid #f5c6c6;padding:6px 12px;border-radius:4px;display:inline-block;">❌ Payment Rejected</span>${order.gcashRejectReason ? `<div style="font-size:0.72rem;color:#c0392b;margin-top:4px;">Reason: ${order.gcashRejectReason}</div>` : ''}</div>`;
        } else {
          actionBtn = `<span style="font-size:0.75rem;font-weight:700;color:#888;padding:6px 12px;">Pending</span>`;
        }
      } else {
        actionBtn = `<button class="my-order-action-btn primary" onclick="showToast('Redirecting to payment...')">PAY NOW</button>`;
      }
    } else if (tab === 'to_ship') {
      actionBtn = `<button class="my-order-action-btn outline" onclick="showToast('Your order is being prepared for shipment.')">TRACK</button>`;
    } else if (tab === 'to_receive') {
      actionBtn = `<button class="my-order-action-btn primary" onclick="confirmReceived('${order.orderNum}')">ORDER RECEIVED</button>`;
    } else if (tab === 'to_rate') {
      actionBtn = `<button class="my-order-action-btn primary" onclick="openRateModal('${order.orderNum}')">RATE NOW</button>`;
    }

    const ratedHTML = order.rated
      ? `<div class="rated-stars">${'★'.repeat(order.rating)}${'☆'.repeat(5 - order.rating)}</div>${order.ratingComment ? `<div class="rated-comment">"${order.ratingComment}"</div>` : ''}`
      : '';

    const card = document.createElement('div');
    card.className = 'my-order-card';
    card.innerHTML = `
      <div class="my-order-card-top">
        <div>
          <span class="my-order-num">#${order.orderNum}</span>
          <span style="color:#aaa;font-size:0.75rem;margin-left:8px;">${date}</span>
        </div>
        <span class="my-order-status" style="background:${color};color:#fff;">${label}</span>
      </div>
      <div class="my-order-items-list">${itemsHTML}</div>
      ${ratedHTML}
      <div class="my-order-footer">
        <div class="my-order-total">Total: <strong>₱${order.total.toLocaleString()}</strong></div>
        ${actionBtn}
      </div>
    `;
    list.appendChild(card);
  });
}

function confirmReceived(orderNum) {
  const order = allOrders.find(o => o.orderNum === orderNum);
  if (!order) return;
  order.status = 'completed';
  refreshMyOrdersBadges();
  renderMyOrders('to_receive');
  showToast('Order marked as received! Please rate your purchase.');

  setTimeout(() => switchMyOrdersTab('to_rate'), 800);
}

function openRateModal(orderNum) {
  ratingTargetOrderNum = orderNum;
  currentRating = 0;
  setRating(0);
  document.getElementById('rate-comment').value = '';
  document.getElementById('rate-order-label').innerText = 'Order #' + orderNum;
  openModal('rate-modal');
}

function setRating(rating) {
  currentRating = rating;
  const stars = document.querySelectorAll('.star');
  stars.forEach((s, i) => s.classList.toggle('active', i < rating));
  const labels = ['', 'Poor 😞', 'Fair 😐', 'Good 😊', 'Great 😄', 'Excellent! 🤩'];
  document.getElementById('rate-label-text').innerText = labels[rating] || '';
}

function submitRating() {
  if (currentRating === 0) return showToast('Please select a star rating.');
  const order = allOrders.find(o => o.orderNum === ratingTargetOrderNum);
  if (!order) return;
  order.rated = true;
  order.rating = currentRating;
  order.ratingComment = document.getElementById('rate-comment').value.trim();
  closeModal('rate-modal');
  refreshMyOrdersBadges();
  switchMyOrdersTab('to_rate');
  showToast('Thank you for your rating! ⭐'.repeat(Math.min(currentRating, 3)));
}

function checkPasswordStrength(pw) {
  const checks = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const tips = [];
  if (!checks.length) tips.push('at least 8 characters');
  if (!checks.upper) tips.push('an uppercase letter');
  if (!checks.lower) tips.push('a lowercase letter');
  if (!checks.number) tips.push('a number');
  if (!checks.special) tips.push('a special character (!@#$...)');
  const tip = tips.length ? 'Password needs: ' + tips.join(', ') + '.' : 'Strong password!';
  return { score, tip, checks };
}

function onPasswordInput() {
  const pw = document.getElementById('signup-password').value;
  const bar = document.getElementById('signup-strength-bar');
  const lbl = document.getElementById('signup-strength-label');
  if (!bar || !lbl) return;
  const { score, tip } = checkPasswordStrength(pw);
  const pct = ['0%', '20%', '40%', '60%', '80%', '100%'][score];
  const colors = ['#ccc', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  bar.style.width = pct;
  bar.style.background = colors[score];
  lbl.innerText = score > 0 ? labels[score] : '';
  lbl.style.color = colors[score];
  if (score === 5) lbl.innerText = '✓ ' + labels[score];
}

function addrKey() { return 'uc_addr_' + (currentUser?.username || 'guest'); }

function saveAddressToStorage(addr) {
  try { localStorage.setItem(addrKey(), JSON.stringify(addr)); } catch (_) { }
}

function getSavedAddress() {
  try {
    const raw = localStorage.getItem(addrKey());
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function formatAddressSummary(a) {
  if (!a) return '';
  return `<strong>${a.fname} ${a.lname}</strong><br>${a.phone}<br>${a.street}<br>${a.city}, ${a.province} ${a.zip}<br>${a.region}`;
}

function fillCheckoutForm(a) {
  if (!a) return;
  const map = {
    'addr-fname': a.fname, 'addr-lname': a.lname,
    'addr-phone': a.phone, 'addr-street': a.street,
    'addr-city': a.city, 'addr-province': a.province,
    'addr-zip': a.zip, 'addr-region': a.region
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val != null) el.value = val;
  });
}

function clearCheckoutForm() {
  ['addr-fname', 'addr-lname', 'addr-phone', 'addr-street', 'addr-city', 'addr-province', 'addr-zip'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const reg = document.getElementById('addr-region'); if (reg) reg.value = '';
}

function prefillSavedAddress() {
  const addr = getSavedAddress();
  const card = document.getElementById('saved-addr-card');
  const banner = document.getElementById('no-addr-banner');
  const formWrap = document.getElementById('addr-form-wrap');

  if (addr) {
    document.getElementById('saved-addr-summary').innerHTML = formatAddressSummary(addr);
    card.style.display = 'block';
    banner.style.display = 'none';
    formWrap.style.display = 'none';
    fillCheckoutForm(addr);
  } else {
    card.style.display = 'none';
    banner.style.display = 'block';
    formWrap.style.display = 'none';
    clearCheckoutForm();
  }
}

function showAddressForm(fromCard) {
  const addr = getSavedAddress();
  document.getElementById('saved-addr-card').style.display = 'none';
  document.getElementById('no-addr-banner').style.display = 'none';
  document.getElementById('addr-form-wrap').style.display = 'block';
  if (fromCard && addr) fillCheckoutForm(addr);
  const actions = document.getElementById('addr-form-actions');
  if (actions) actions.style.display = fromCard ? 'block' : 'none';
}

function cancelAddressEdit() { prefillSavedAddress(); }

const GCASH_OWNER = { name: 'Tirso Jr. Gervacio', number: '09931229769' };
let gcashProofDataUrl = null;

let gcashSavedAddress = null;

function launchGCashRedirect() {
  const subtotal = cart.reduce((s, i) => s + i.finalPrice * (i.qty || 1), 0);
  const total = subtotal + 150;
  gcashProofDataUrl = null;

  gcashSavedAddress = {
    fname: document.getElementById('addr-fname').value.trim(),
    lname: document.getElementById('addr-lname').value.trim(),
    phone: document.getElementById('addr-phone').value.trim(),
    street: document.getElementById('addr-street').value.trim(),
    city: document.getElementById('addr-city').value.trim(),
    province: document.getElementById('addr-province').value.trim(),
    zip: document.getElementById('addr-zip').value.trim(),
    region: document.getElementById('addr-region').value,
  };

  closeModal('checkout-modal');

  const overlay = document.createElement('div');
  overlay.id = 'gcash-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:20px 0;';

  overlay.innerHTML = `
    <div style="background:#fff;width:360px;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
      <div style="background:#00a3e0;padding:24px 20px 18px;text-align:center;">
        <div style="font-size:2.5rem;margin-bottom:4px;">💙</div>
        <div style="color:#fff;font-family:Anton,sans-serif;font-size:1.6rem;letter-spacing:2px;">GCash</div>
        <div style="color:rgba(255,255,255,0.85);font-size:0.78rem;margin-top:2px;">Send payment to</div>
      </div>
      <div style="padding:24px 24px 20px;">
        <div style="background:#f0f9ff;border:1px solid #bae0f7;border-radius:10px;padding:16px;margin-bottom:20px;text-align:center;">
          <div style="font-size:0.7rem;color:#888;font-weight:700;letter-spacing:1px;margin-bottom:4px;">ACCOUNT NAME</div>
          <div style="font-size:1.05rem;font-weight:900;color:#111;margin-bottom:12px;">${GCASH_OWNER.name}</div>
          <div style="font-size:0.7rem;color:#888;font-weight:700;letter-spacing:1px;margin-bottom:4px;">GCASH NUMBER</div>
          <div style="font-size:1.4rem;font-weight:900;color:#00a3e0;letter-spacing:2px;">${GCASH_OWNER.number}</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;background:#f9f9f9;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
          <span style="font-size:0.78rem;font-weight:700;color:#888;letter-spacing:1px;">AMOUNT TO PAY</span>
          <span style="font-size:1.4rem;font-weight:900;color:#111;">₱${total.toLocaleString()}</span>
        </div>
        <div style="margin-bottom:18px;">
          <div style="font-size:0.72rem;font-weight:700;letter-spacing:1px;color:#555;margin-bottom:8px;">STEP 1 — Open GCash app and send ₱${total.toLocaleString()} to the number above.</div>
          <div style="font-size:0.72rem;font-weight:700;letter-spacing:1px;color:#555;margin-bottom:8px;">STEP 2 — Take a screenshot of your payment receipt.</div>
          <div style="font-size:0.72rem;font-weight:700;letter-spacing:1px;color:#555;margin-bottom:12px;">STEP 3 — Upload your proof of payment below.</div>
          <label id="proof-upload-label" style="display:flex;align-items:center;justify-content:center;gap:10px;border:2px dashed #bae0f7;border-radius:8px;padding:16px;cursor:pointer;transition:0.2s;background:#fafeff;">
            <span style="font-size:1.4rem;">📎</span>
            <span id="proof-label-text" style="font-size:0.8rem;font-weight:700;color:#00a3e0;">UPLOAD SCREENSHOT</span>
            <input type="file" id="gcash-proof-input" accept="image/*" style="display:none;" onchange="previewGCashProof(this)">
          </label>
          <div id="gcash-proof-preview" style="display:none;margin-top:10px;text-align:center;">
            <img id="gcash-proof-img" src="" style="max-width:100%;max-height:160px;border-radius:6px;border:1px solid #ddd;">
            <div style="font-size:0.72rem;color:#27ae60;font-weight:700;margin-top:6px;">✅ Screenshot uploaded</div>
          </div>
        </div>
        <div style="margin-bottom:12px;">
          <label style="font-size:0.72rem;font-weight:700;letter-spacing:1px;color:#555;display:block;margin-bottom:6px;">REFERENCE NUMBER (from receipt)</label>
          <input id="gcash-ref-input" type="text" placeholder="e.g. 1234567890" style="width:100%;padding:10px 14px;border:1.5px solid #ddd;font-size:0.9rem;outline:none;border-radius:6px;font-family:Inter,sans-serif;">
        </div>
        <div id="gcash-submit-error" style="display:none;color:#c0392b;font-size:0.78rem;font-weight:700;margin-bottom:10px;"></div>
        <button onclick="confirmGCashPayment()" style="width:100%;padding:14px;background:#00a3e0;color:#fff;border:none;border-radius:8px;font-size:0.95rem;font-weight:700;cursor:pointer;letter-spacing:1px;margin-bottom:10px;">
          ✓ I PAID — SUBMIT ORDER
        </button>
        <button onclick="cancelGCashPayment()" style="width:100%;padding:10px;background:transparent;color:#888;border:1px solid #ddd;border-radius:8px;font-size:0.82rem;cursor:pointer;">
          Cancel
        </button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

function previewGCashProof(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    gcashProofDataUrl = e.target.result;
    document.getElementById('gcash-proof-img').src = gcashProofDataUrl;
    document.getElementById('gcash-proof-preview').style.display = 'block';
    document.getElementById('proof-label-text').innerText = 'CHANGE SCREENSHOT';
  };
  reader.readAsDataURL(file);
}

function confirmGCashPayment() {
  const ref = (document.getElementById('gcash-ref-input').value || '').trim();
  const errEl = document.getElementById('gcash-submit-error');
  if (!gcashProofDataUrl) {
    errEl.style.display = 'block';
    errEl.innerText = 'Please upload your GCash screenshot first.';
    return;
  }
  if (!ref) {
    errEl.style.display = 'block';
    errEl.innerText = 'Please enter the reference number from your receipt.';
    return;
  }
  errEl.style.display = 'none';
  const overlay = document.getElementById('gcash-overlay');
  if (overlay) overlay.remove();
  placeOrder({
    gcashProof: gcashProofDataUrl,
    gcashRef: ref,
    gcashStatus: 'pending_confirmation',
    address: gcashSavedAddress
  });
  openModal('checkout-modal');
}

function cancelGCashPayment() {
  const overlay = document.getElementById('gcash-overlay');
  if (overlay) overlay.remove();
  gcashProofDataUrl = null;
  openModal('checkout-modal');
}

function openAddressBook() {
  const addr = getSavedAddress();
  const savedDiv = document.getElementById('address-book-saved');
  const emptyDiv = document.getElementById('address-book-empty');
  const formDiv = document.getElementById('address-book-form');
  if (addr) {
    document.getElementById('ab-saved-display').innerHTML = `
      <div class="ab-field"><span class="ab-label">NAME</span><span>${addr.fname} ${addr.lname}</span></div>
      <div class="ab-field"><span class="ab-label">PHONE</span><span>${addr.phone}</span></div>
      <div class="ab-field"><span class="ab-label">ADDRESS</span><span>${addr.street}</span></div>
      <div class="ab-field"><span class="ab-label">CITY</span><span>${addr.city}, ${addr.province} ${addr.zip}</span></div>
      <div class="ab-field"><span class="ab-label">REGION</span><span>${addr.region}</span></div>
    `;
    savedDiv.style.display = 'block';
    emptyDiv.style.display = 'none';
    formDiv.style.display = 'none';
  } else {
    savedDiv.style.display = 'none';
    emptyDiv.style.display = 'block';
    formDiv.style.display = 'block';
    clearAddressBookForm();
  }
  openModal('address-book-modal');
}

function showAddressBookForm() {
  const addr = getSavedAddress();
  document.getElementById('address-book-saved').style.display = 'none';
  document.getElementById('address-book-empty').style.display = 'none';
  document.getElementById('address-book-form').style.display = 'block';
  if (addr) {
    const map = {
      'ab-fname': addr.fname, 'ab-lname': addr.lname,
      'ab-phone': addr.phone, 'ab-street': addr.street,
      'ab-city': addr.city, 'ab-province': addr.province,
      'ab-zip': addr.zip, 'ab-region': addr.region
    };
    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id); if (el && val) el.value = val;
    });
  }
}

function clearAddressBookForm() {
  ['ab-fname', 'ab-lname', 'ab-phone', 'ab-street', 'ab-city', 'ab-province', 'ab-zip'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const r = document.getElementById('ab-region'); if (r) r.value = '';
}

function cancelAddressBookForm() {
  openAddressBook();
}

function saveAddressBook() {
  const fname = document.getElementById('ab-fname').value.trim();
  const lname = document.getElementById('ab-lname').value.trim();
  const phone = document.getElementById('ab-phone').value.trim();
  const street = document.getElementById('ab-street').value.trim();
  const city = document.getElementById('ab-city').value.trim();
  const province = document.getElementById('ab-province').value.trim();
  const zip = document.getElementById('ab-zip').value.trim();
  const region = document.getElementById('ab-region').value;
  if (!fname || !lname) return showToast('Please enter your full name.');
  if (!phone || phone.length !== 11) return showToast('Please enter a valid 11-digit phone number.');
  if (!street) return showToast('Please enter your street address.');
  if (!city || !province || !zip || !region) return showToast('Please fill in all address fields.');
  saveAddressToStorage({ fname, lname, phone, street, city, province, zip, region });
  showToast('✅ Address saved!');
  openAddressBook();
}
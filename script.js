const products = [
  { id: "rice", name: "Rice (Plain)", price: 1500, mark: "RC" },
  { id: "fried-chicken", name: "Fried Chicken (1 pc)", price: 6500, mark: "CH" },
  { id: "pork-adobo", name: "Pork Adobo", price: 6000, mark: "PA" },
  { id: "vegetable-side", name: "Vegetable Side Dish", price: 3500, mark: "VG" },
  { id: "iced-tea", name: "Iced Tea (cup)", price: 2000, mark: "IT" },
  { id: "bottled-water", name: "Bottled Water", price: 2000, mark: "BW" }
];

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const grandTotal = document.getElementById("grandTotal");
const changeAmount = document.getElementById("changeAmount");
const itemCount = document.getElementById("itemCount");
const cashInput = document.getElementById("cashInput");
const validationMessage = document.getElementById("validationMessage");

let cart = [];

function formatPeso(centavos) {
  return `₱${(centavos / 100).toFixed(2)}`;
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function getCartItemCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function parsePaymentToCentavos(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue || !/^\d+(\.\d{1,2})?$/.test(trimmedValue)) {
    return null;
  }

  const [pesoPart, centavoPart = ""] = trimmedValue.split(".");
  return Number(pesoPart) * 100 + Number(centavoPart.padEnd(2, "0"));
}

function renderProducts() {
  productGrid.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="product-topline">
        <div>
          <h3>${product.name}</h3>
          <p class="product-price">${formatPeso(product.price)}</p>
        </div>
        <span class="product-mark" aria-hidden="true">${product.mark}</span>
      </div>
      <button class="add-cart-btn" type="button" data-product-id="${product.id}">Add to Cart</button>
    </article>
  `).join("");
}

function setMessage(message, type = "error") {
  validationMessage.textContent = message;
  validationMessage.className = `message show ${type}`;
}

function clearMessage() {
  validationMessage.textContent = "";
  validationMessage.className = "message";
}

function updateChangeDisplay() {
  const cashCentavos = parsePaymentToCentavos(cashInput.value);
  const total = getCartTotal();

  if (cashCentavos === null || cashCentavos < total) {
    changeAmount.textContent = formatPeso(0);
    return;
  }

  changeAmount.textContent = formatPeso(cashCentavos - total);
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">No products have been added yet.</p>';
  } else {
    cartItems.innerHTML = cart.map((item) => `
      <div class="cart-row" data-product-id="${item.id}">
        <div>
          <p class="cart-name">${item.name}</p>
          <p class="cart-price">${formatPeso(item.price)} each</p>
        </div>
        <div class="qty-controls" aria-label="Quantity controls for ${item.name}">
          <button class="qty-btn" type="button" data-action="decrease" aria-label="Decrease ${item.name} quantity">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" type="button" data-action="increase" aria-label="Increase ${item.name} quantity">+</button>
        </div>
        <span class="cart-subtotal">${formatPeso(item.price * item.quantity)}</span>
        <button class="remove-btn" type="button" data-action="remove" aria-label="Remove ${item.name}">×</button>
      </div>
    `).join("");
  }

  const count = getCartItemCount();
  grandTotal.textContent = formatPeso(getCartTotal());
  itemCount.textContent = `${count} ${count === 1 ? "item" : "items"}`;
  updateChangeDisplay();
}

function addToCart(productId) {
  const product = getProduct(productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  clearMessage();
  renderCart();
}

function updateQuantity(productId, direction) {
  const cartItem = cart.find((item) => item.id === productId);

  if (!cartItem) {
    return;
  }

  if (direction === "increase") {
    cartItem.quantity += 1;
  }

  if (direction === "decrease") {
    cartItem.quantity -= 1;
  }

  if (cartItem.quantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  }

  clearMessage();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  clearMessage();
  renderCart();
}

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-product-id]");

  if (!addButton) {
    return;
  }

  addToCart(addButton.dataset.productId);
});

cartItems.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  const cartRow = event.target.closest("[data-product-id]");

  if (!actionButton || !cartRow) {
    return;
  }

  const { action } = actionButton.dataset;
  const productId = cartRow.dataset.productId;

  if (action === "remove") {
    removeFromCart(productId);
    return;
  }

  updateQuantity(productId, action);
});

cashInput.addEventListener("input", () => {
  clearMessage();
  updateChangeDisplay();
});

renderProducts();
renderCart();

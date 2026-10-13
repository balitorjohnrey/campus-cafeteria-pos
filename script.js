const products = [
  {
    id: "rice",
    name: "Rice (Plain)",
    price: 1500,
    image: "assets/products/rice-plain.png",
    description: "Steamed plain rice served warm."
  },
  {
    id: "fried-chicken",
    name: "Fried Chicken (1 pc)",
    price: 6500,
    image: "assets/products/fried-chicken.png",
    description: "Crispy chicken piece with savory seasoning."
  },
  {
    id: "pork-adobo",
    name: "Pork Adobo",
    price: 6000,
    image: "assets/products/pork-adobo.png",
    description: "Classic pork adobo in soy-vinegar sauce."
  },
  {
    id: "vegetable-side",
    name: "Vegetable Side Dish",
    price: 3500,
    image: "assets/products/vegetable-side-dish.png",
    description: "Fresh vegetable side for a balanced meal."
  },
  {
    id: "iced-tea",
    name: "Iced Tea (cup)",
    price: 2000,
    image: "assets/products/iced-tea.png",
    description: "Cold sweet iced tea in a cup."
  },
  {
    id: "bottled-water",
    name: "Bottled Water",
    price: 2000,
    image: "assets/products/bottled-water.png",
    description: "Refreshing bottled drinking water."
  }
];

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const grandTotal = document.getElementById("grandTotal");
const changeAmount = document.getElementById("changeAmount");
const itemCount = document.getElementById("itemCount");
const cashInput = document.getElementById("cashInput");
const validationMessage = document.getElementById("validationMessage");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
const receiptSection = document.getElementById("receiptSection");
const paymentSummary = document.getElementById("paymentSummary");
const receipt = document.getElementById("receipt");
const printReceiptBtn = document.getElementById("printReceiptBtn");
const newTransactionBtn = document.getElementById("newTransactionBtn");
const menuSearch = document.getElementById("menuSearch");

let cart = [];
let transactionPaid = false;

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

  if (!trimmedValue || !/^(?:\d+|\d*\.\d{1,2})$/.test(trimmedValue)) {
    return null;
  }

  const [pesoPart = "0", centavoPart = ""] = trimmedValue.split(".");
  const pesos = pesoPart === "" ? 0 : Number(pesoPart);
  return pesos * 100 + Number(centavoPart.padEnd(2, "0"));
}

function formatReceiptDate(date) {
  return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function createTransactionReference() {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");
  const timePart = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0")
  ].join("");

  return `CAF-${datePart}-${timePart}-${String(now.getMilliseconds()).padStart(3, "0")}`;
}

function validatePayment() {
  const paymentValue = cashInput.value.trim();
  const total = getCartTotal();

  if (cart.length === 0) {
    return {
      valid: false,
      message: "Please add products to your cart before proceeding."
    };
  }

  if (transactionPaid) {
    return {
      valid: false,
      message: "This transaction has already been paid. Start a new transaction to continue."
    };
  }

  if (paymentValue === "") {
    return {
      valid: false,
      message: "Please enter a valid payment amount."
    };
  }

  if (paymentValue.includes("-")) {
    return {
      valid: false,
      message: "Payment amount cannot be negative."
    };
  }

  if (!/^[0-9.]+$/.test(paymentValue)) {
    return {
      valid: false,
      message: "Please enter a valid payment amount."
    };
  }

  if (paymentValue.split(".").length > 2 || parsePaymentToCentavos(paymentValue) === null) {
    return {
      valid: false,
      message: "Please enter a valid payment amount with up to two decimal places."
    };
  }

  const cashCentavos = parsePaymentToCentavos(paymentValue);

  if (cashCentavos < total) {
    return {
      valid: false,
      message: `Insufficient payment. Please enter at least ${formatPeso(total)}.`
    };
  }

  return {
    valid: true,
    cashCentavos
  };
}

function renderProducts() {
  const searchTerm = menuSearch.value.trim().toLowerCase();
  const visibleProducts = products.filter((product) => (
    product.name.toLowerCase().includes(searchTerm)
    || product.description.toLowerCase().includes(searchTerm)
  ));

  if (visibleProducts.length === 0) {
    productGrid.innerHTML = '<p class="empty-products">No matching products found.</p>';
    return;
  }

  productGrid.innerHTML = visibleProducts.map((product) => {
    const cartItem = cart.find((item) => item.id === product.id);

    return `
    <article class="product-card">
      <div class="product-visual">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-copy">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
      </div>
      <div class="product-actions">
        <strong class="product-price">${formatPeso(product.price)}</strong>
        ${cartItem ? `
          <div class="inline-qty" aria-label="Quantity controls for ${product.name}">
            <button class="qty-btn" type="button" data-card-action="decrease" data-product-id="${product.id}" aria-label="Decrease ${product.name} quantity" ${transactionPaid ? "disabled" : ""}>−</button>
            <span class="qty-value">${cartItem.quantity}</span>
            <button class="qty-btn" type="button" data-card-action="increase" data-product-id="${product.id}" aria-label="Increase ${product.name} quantity" ${transactionPaid ? "disabled" : ""}>+</button>
          </div>
        ` : `
          <button class="add-cart-btn" type="button" data-card-action="add" data-product-id="${product.id}" ${transactionPaid ? "disabled" : ""}>Add</button>
        `}
      </div>
    </article>
  `;
  }).join("");
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
        <div class="cart-copy">
          <p class="cart-name">${item.name}</p>
          <p class="cart-price">${formatPeso(item.price)} each</p>
        </div>
        <div class="qty-controls" aria-label="Quantity controls for ${item.name}">
          <button class="qty-btn" type="button" data-action="decrease" aria-label="Decrease ${item.name} quantity" ${transactionPaid ? "disabled" : ""}>−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" type="button" data-action="increase" aria-label="Increase ${item.name} quantity" ${transactionPaid ? "disabled" : ""}>+</button>
        </div>
        <span class="cart-subtotal">${formatPeso(item.price * item.quantity)}</span>
        <button class="remove-btn" type="button" data-action="remove" aria-label="Remove ${item.name}" ${transactionPaid ? "disabled" : ""}>×</button>
      </div>
    `).join("");
  }

  const count = getCartItemCount();
  grandTotal.textContent = formatPeso(getCartTotal());
  itemCount.textContent = `${count} ${count === 1 ? "item" : "items"}`;
  updateChangeDisplay();
}

function addToCart(productId) {
  if (transactionPaid) {
    return;
  }

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
  renderProducts();
  renderCart();
}

function updateQuantity(productId, direction) {
  if (transactionPaid) {
    return;
  }

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
  renderProducts();
  renderCart();
}

function removeFromCart(productId) {
  if (transactionPaid) {
    return;
  }

  cart = cart.filter((item) => item.id !== productId);
  clearMessage();
  renderProducts();
  renderCart();
}

function renderPaymentSummary(transaction) {
  paymentSummary.innerHTML = `
    <h2>Payment Successful!</h2>
    <p>Total Amount: ${formatPeso(transaction.total)}</p>
    <p>Cash Received: ${formatPeso(transaction.cash)}</p>
    <p>Change: ${formatPeso(transaction.change)}</p>
  `;
}

function renderReceipt(transaction) {
  const receiptLines = transaction.items.map((item) => `
    <div class="receipt-line">
      <span>
        ${item.name}
        <small>${item.quantity} × ${formatPeso(item.price)}</small>
      </span>
      <strong>${formatPeso(item.price * item.quantity)}</strong>
    </div>
  `).join("");

  receipt.innerHTML = `
    <h2>CafeTrack</h2>
    <div class="receipt-meta">
      <p><strong>Transaction No.:</strong> ${transaction.reference}</p>
      <p><strong>Date &amp; Time:</strong> ${formatReceiptDate(transaction.date)}</p>
    </div>
    <div class="receipt-meta">
      ${receiptLines}
    </div>
    <div class="receipt-total">
      <div><span>Total Amount</span><strong>${formatPeso(transaction.total)}</strong></div>
      <div><span>Cash Received</span><strong>${formatPeso(transaction.cash)}</strong></div>
      <div><span>Change</span><strong>${formatPeso(transaction.change)}</strong></div>
    </div>
    <p class="receipt-thanks">Thank you for dining at the Campus Cafeteria.</p>
  `;
}

function confirmPayment() {
  const validation = validatePayment();

  if (!validation.valid) {
    setMessage(validation.message);
    return;
  }

  const transaction = {
    reference: createTransactionReference(),
    date: new Date(),
    items: cart.map((item) => ({ ...item })),
    total: getCartTotal(),
    cash: validation.cashCentavos,
    change: validation.cashCentavos - getCartTotal()
  };

  transactionPaid = true;
  cashInput.disabled = true;
  confirmPaymentBtn.disabled = true;
  clearMessage();
  setMessage("Payment Successful!", "success");
  changeAmount.textContent = formatPeso(transaction.change);
  renderProducts();
  renderCart();
  renderPaymentSummary(transaction);
  renderReceipt(transaction);
  receiptSection.hidden = false;
  receiptSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function startNewTransaction() {
  cart = [];
  transactionPaid = false;
  cashInput.value = "";
  cashInput.disabled = false;
  confirmPaymentBtn.disabled = false;
  receiptSection.hidden = true;
  paymentSummary.innerHTML = "";
  receipt.innerHTML = "";
  clearMessage();
  renderProducts();
  renderCart();
  cashInput.focus();
}

productGrid.addEventListener("click", (event) => {
  const productButton = event.target.closest("[data-card-action]");

  if (!productButton) {
    return;
  }

  const { cardAction, productId } = productButton.dataset;

  if (cardAction === "add") {
    addToCart(productId);
    return;
  }

  updateQuantity(productId, cardAction);
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

menuSearch.addEventListener("input", renderProducts);

cashInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    confirmPayment();
  }
});

confirmPaymentBtn.addEventListener("click", confirmPayment);

printReceiptBtn.addEventListener("click", () => {
  window.print();
});

newTransactionBtn.addEventListener("click", startNewTransaction);

renderProducts();
renderCart();

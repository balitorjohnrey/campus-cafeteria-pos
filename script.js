const DEFAULT_PRODUCTS = [
  {
    id: "rice",
    name: "Rice (Plain)",
    price: 1500,
    image: "assets/products/rice-plain.png",
    description: "Steamed plain rice served warm.",
    category: "rice",
    stock: 30,
    sold: 0
  },
  {
    id: "fried-chicken",
    name: "Fried Chicken (1 pc)",
    price: 6500,
    image: "assets/products/fried-chicken.png",
    description: "Crispy chicken piece with savory seasoning.",
    category: "main",
    stock: 20,
    sold: 0
  },
  {
    id: "pork-adobo",
    name: "Pork Adobo",
    price: 6000,
    image: "assets/products/pork-adobo.png",
    description: "Classic pork adobo in soy-vinegar sauce.",
    category: "main",
    stock: 18,
    sold: 0
  },
  {
    id: "vegetable-side",
    name: "Vegetable Side Dish",
    price: 3500,
    image: "assets/products/vegetable-side-dish.png",
    description: "Fresh vegetable side for a balanced meal.",
    category: "side",
    stock: 20,
    sold: 0
  },
  {
    id: "iced-tea",
    name: "Iced Tea (cup)",
    price: 2000,
    image: "assets/products/iced-tea.png",
    description: "Cold sweet iced tea in a cup.",
    category: "beverage",
    stock: 30,
    sold: 0
  },
  {
    id: "bottled-water",
    name: "Bottled Water",
    price: 2000,
    image: "assets/products/bottled-water.png",
    description: "Refreshing bottled drinking water.",
    category: "beverage",
    stock: 35,
    sold: 0
  }
];

const CATEGORY_LABELS = {
  all: "Food & Drinks",
  rice: "Rice Meals",
  main: "Main Dishes",
  side: "Side Dish",
  beverage: "Beverages"
};

const PRODUCTS_STORAGE_KEY = "cafetrackProducts";
const HISTORY_STORAGE_KEY = "cafetrackPurchaseHistory";
const DEFAULT_IMAGE = "assets/products/default-product.svg";

const categoryButtons = document.querySelectorAll(".category-btn");
const menuView = document.getElementById("menuView");
const historyView = document.getElementById("historyView");
const manageView = document.getElementById("manageView");
const productsHeading = document.getElementById("productsHeading");
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
const historyList = document.getElementById("historyList");
const addProductForm = document.getElementById("addProductForm");
const inventoryList = document.getElementById("inventoryList");
const newProductName = document.getElementById("newProductName");
const newProductCategory = document.getElementById("newProductCategory");
const newProductPrice = document.getElementById("newProductPrice");
const newProductStock = document.getElementById("newProductStock");
const newProductDescription = document.getElementById("newProductDescription");
const newProductImage = document.getElementById("newProductImage");

let products = loadProducts();
let purchaseHistory = loadHistory();
let cart = [];
let currentCategory = "all";
let transactionPaid = false;

function cloneProduct(product) {
  return { ...product };
}

function loadProducts() {
  const fallbackProducts = DEFAULT_PRODUCTS.map(cloneProduct);
  const savedProducts = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY) || "null");

  if (!Array.isArray(savedProducts)) {
    return fallbackProducts;
  }

  const normalizedProducts = savedProducts.map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    image: product.image || DEFAULT_IMAGE,
    description: product.description || "CafeTrack menu item.",
    category: product.category || "main",
    stock: Math.max(0, Number(product.stock) || 0),
    sold: Math.max(0, Number(product.sold) || 0)
  }));

  fallbackProducts.forEach((defaultProduct) => {
    const existingProduct = normalizedProducts.find((product) => product.id === defaultProduct.id);
    if (!existingProduct) {
      normalizedProducts.push(defaultProduct);
      return;
    }

    Object.assign(existingProduct, {
      image: existingProduct.image || defaultProduct.image,
      description: existingProduct.description || defaultProduct.description,
      category: existingProduct.category || defaultProduct.category
    });
  });

  return normalizedProducts;
}

function loadHistory() {
  const savedHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
  return Array.isArray(savedHistory) ? savedHistory : [];
}

function saveProducts() {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

function saveHistory() {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(purchaseHistory));
}

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
  return new Date(date).toLocaleString("en-PH", {
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

  const unavailableItem = cart.find((item) => {
    const product = getProduct(item.id);
    return !product || item.quantity > product.stock;
  });

  if (unavailableItem) {
    return {
      valid: false,
      message: `${unavailableItem.name} does not have enough available quantity.`
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

function setMessage(message, type = "error") {
  validationMessage.textContent = message;
  validationMessage.className = `message show ${type}`;
}

function clearMessage() {
  validationMessage.textContent = "";
  validationMessage.className = "message";
}

function showView(viewName) {
  menuView.hidden = viewName !== "menu";
  historyView.hidden = viewName !== "history";
  manageView.hidden = viewName !== "manage";

  if (viewName === "history") {
    renderHistory();
  }

  if (viewName === "manage") {
    renderInventory();
  }
}

function setActiveCategory(button) {
  categoryButtons.forEach((categoryButton) => categoryButton.classList.remove("active"));
  button.classList.add("active");
}

function getVisibleProducts() {
  const searchTerm = menuSearch.value.trim().toLowerCase();

  return products.filter((product) => {
    const categoryMatches = currentCategory === "all" || product.category === currentCategory;
    const searchMatches = product.name.toLowerCase().includes(searchTerm)
      || product.description.toLowerCase().includes(searchTerm);

    return categoryMatches && searchMatches;
  });
}

function renderProducts() {
  productsHeading.textContent = CATEGORY_LABELS[currentCategory] || "Food & Drinks";

  const visibleProducts = getVisibleProducts();

  if (visibleProducts.length === 0) {
    productGrid.innerHTML = '<p class="empty-products">No matching products found.</p>';
    return;
  }

  productGrid.innerHTML = visibleProducts.map((product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    const selectedQuantity = cartItem ? cartItem.quantity : 0;
    const isSoldOut = product.stock <= 0;
    const reachedCartLimit = selectedQuantity >= product.stock;

    return `
    <article class="product-card">
      <div class="product-visual">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-copy">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <span class="stock-chip ${isSoldOut ? "sold-out" : ""}">${isSoldOut ? "Sold out" : `Available: ${product.stock}`}</span>
      </div>
      <div class="product-actions">
        <strong class="product-price">${formatPeso(product.price)}</strong>
        ${cartItem ? `
          <div class="inline-qty" aria-label="Quantity controls for ${product.name}">
            <button class="qty-btn" type="button" data-card-action="decrease" data-product-id="${product.id}" aria-label="Decrease ${product.name} quantity" ${transactionPaid ? "disabled" : ""}>−</button>
            <span class="qty-value">${cartItem.quantity}</span>
            <button class="qty-btn" type="button" data-card-action="increase" data-product-id="${product.id}" aria-label="Increase ${product.name} quantity" ${transactionPaid || reachedCartLimit ? "disabled" : ""}>+</button>
          </div>
        ` : `
          <button class="add-cart-btn" type="button" data-card-action="add" data-product-id="${product.id}" ${transactionPaid || isSoldOut ? "disabled" : ""}>${isSoldOut ? "Sold Out" : "Add"}</button>
        `}
      </div>
    </article>
  `;
  }).join("");
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
    cartItems.innerHTML = cart.map((item) => {
      const product = getProduct(item.id);
      const reachedCartLimit = product && item.quantity >= product.stock;

      return `
      <div class="cart-row" data-product-id="${item.id}">
        <div class="cart-copy">
          <p class="cart-name">${item.name}</p>
          <p class="cart-price">${formatPeso(item.price)} each</p>
        </div>
        <div class="qty-controls" aria-label="Quantity controls for ${item.name}">
          <button class="qty-btn" type="button" data-action="decrease" aria-label="Decrease ${item.name} quantity" ${transactionPaid ? "disabled" : ""}>−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" type="button" data-action="increase" aria-label="Increase ${item.name} quantity" ${transactionPaid || reachedCartLimit ? "disabled" : ""}>+</button>
        </div>
        <span class="cart-subtotal">${formatPeso(item.price * item.quantity)}</span>
        <button class="remove-btn" type="button" data-action="remove" aria-label="Remove ${item.name}" ${transactionPaid ? "disabled" : ""}>×</button>
      </div>
    `;
    }).join("");
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
  const selectedQuantity = existingItem ? existingItem.quantity : 0;

  if (!product) {
    return;
  }

  if (product.stock <= 0) {
    setMessage(`${product.name} is currently sold out.`);
    return;
  }

  if (selectedQuantity >= product.stock) {
    setMessage(`Only ${product.stock} ${product.name} available.`);
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
  const product = getProduct(productId);

  if (!cartItem || !product) {
    return;
  }

  if (direction === "increase") {
    if (cartItem.quantity >= product.stock) {
      setMessage(`Only ${product.stock} ${product.name} available.`);
      return;
    }

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

function updateInventoryAfterPurchase(items) {
  items.forEach((item) => {
    const product = getProduct(item.id);
    if (!product) {
      return;
    }

    product.stock = Math.max(0, product.stock - item.quantity);
    product.sold += item.quantity;
  });

  saveProducts();
}

function saveTransaction(transaction) {
  purchaseHistory.unshift({
    ...transaction,
    date: transaction.date.toISOString()
  });
  purchaseHistory = purchaseHistory.slice(0, 30);
  saveHistory();
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

  updateInventoryAfterPurchase(transaction.items);
  saveTransaction(transaction);

  transactionPaid = true;
  cashInput.disabled = true;
  confirmPaymentBtn.disabled = true;
  clearMessage();
  setMessage("Payment Successful!", "success");
  changeAmount.textContent = formatPeso(transaction.change);
  renderProducts();
  renderCart();
  renderInventory();
  renderHistory();
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

function renderHistory() {
  if (purchaseHistory.length === 0) {
    historyList.innerHTML = '<p class="empty-products">No completed transactions yet.</p>';
    return;
  }

  historyList.innerHTML = purchaseHistory.map((transaction) => {
    const itemText = transaction.items
      .map((item) => `${item.name} × ${item.quantity}`)
      .join(", ");

    return `
      <article class="history-card">
        <div>
          <h3>${transaction.reference}</h3>
          <p>${formatReceiptDate(transaction.date)}</p>
          <p>${itemText}</p>
        </div>
        <strong>${formatPeso(transaction.total)}</strong>
      </article>
    `;
  }).join("");
}

function renderInventory() {
  inventoryList.innerHTML = products.map((product) => `
    <article class="inventory-row" data-product-id="${product.id}">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <p>${CATEGORY_LABELS[product.category]} • Sold: ${product.sold}</p>
      </div>
      <label>
        Price
        <input class="inventory-price" type="number" min="0.01" step="0.01" value="${(product.price / 100).toFixed(2)}">
      </label>
      <label>
        Quantity
        <input class="inventory-stock" type="number" min="0" step="1" value="${product.stock}">
      </label>
      <button class="secondary-action save-product-btn" type="button">Update</button>
    </article>
  `).join("");
}

function createProductId(name) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now()}`;
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(DEFAULT_IMAGE);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(new Error("Unable to read image file.")));
    reader.readAsDataURL(file);
  });
}

async function handleAddProduct(event) {
  event.preventDefault();

  const priceCentavos = parsePaymentToCentavos(newProductPrice.value);
  const stock = Number(newProductStock.value);

  if (!newProductName.value.trim() || priceCentavos === null || priceCentavos <= 0 || !Number.isInteger(stock) || stock < 0) {
    setMessage("Please enter a valid product name, price, and quantity.");
    return;
  }

  const image = await readImageAsDataUrl(newProductImage.files[0]);
  const newProduct = {
    id: createProductId(newProductName.value),
    name: newProductName.value.trim(),
    price: priceCentavos,
    image,
    description: newProductDescription.value.trim() || "CafeTrack menu item.",
    category: newProductCategory.value,
    stock,
    sold: 0
  };

  products.push(newProduct);
  saveProducts();
  addProductForm.reset();
  currentCategory = newProduct.category;
  showView("menu");
  categoryButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.category === currentCategory);
  });
  setMessage(`${newProduct.name} added successfully.`, "success");
  renderProducts();
  renderInventory();
}

function handleInventoryUpdate(button) {
  const row = button.closest("[data-product-id]");
  const product = getProduct(row.dataset.productId);
  const priceInput = row.querySelector(".inventory-price");
  const stockInput = row.querySelector(".inventory-stock");
  const priceCentavos = parsePaymentToCentavos(priceInput.value);
  const stock = Number(stockInput.value);

  if (!product || priceCentavos === null || priceCentavos <= 0 || !Number.isInteger(stock) || stock < 0) {
    setMessage("Please enter a valid price and quantity.");
    return;
  }

  product.price = priceCentavos;
  product.stock = stock;
  saveProducts();
  setMessage(`${product.name} updated successfully.`, "success");
  renderProducts();
  renderInventory();
  renderCart();
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveCategory(button);
    clearMessage();

    if (button.dataset.view === "menu") {
      currentCategory = button.dataset.category || "all";
      showView("menu");
      renderProducts();
      return;
    }

    showView(button.dataset.view);
  });
});

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

inventoryList.addEventListener("click", (event) => {
  const updateButton = event.target.closest(".save-product-btn");

  if (updateButton) {
    handleInventoryUpdate(updateButton);
  }
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
addProductForm.addEventListener("submit", handleAddProduct);

printReceiptBtn.addEventListener("click", () => {
  window.print();
});

newTransactionBtn.addEventListener("click", startNewTransaction);

renderProducts();
renderCart();
renderHistory();
renderInventory();

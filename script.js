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

function formatPeso(centavos) {
  return `₱${(centavos / 100).toFixed(2)}`;
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

function renderInitialCart() {
  cartItems.innerHTML = '<p class="empty-cart">No products have been added yet.</p>';
  grandTotal.textContent = formatPeso(0);
  changeAmount.textContent = formatPeso(0);
  itemCount.textContent = "0 items";
}

renderProducts();
renderInitialCart();

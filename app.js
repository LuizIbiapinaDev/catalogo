const PRODUCTS_SHEET_URL = "AKfycbyEe72LgqX06hm7mnS_2g4UgtEOI8mzLIJaoSfrCBBOnk19CY9E0pIWhz0B2AaqMgA";
const ORDERS_SHEET_URL = "https://script.google.com/macros/s/AKfycbyEe72LgqX06hm7mnS_2g4UgtEOI8mzLIJaoSfrCBBOnk19CY9E0pIWhz0B2AaqMgA/exec";
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});

async function fetchProducts() {
  const response = await fetch(PRODUCTS_SHEET_URL);
  const products = await response.json();
  
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";
  
  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>R$${product.price}</p>
      <input type="number" min="1" value="1" id="quantity-${product.id}">
      <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Adicionar ao Carrinho</button>
    `;
    productsContainer.appendChild(productCard);
  });
}

function addToCart(productId, name, price) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  const quantity = parseInt(quantityInput.value) || 1;

  const existingProduct = cart.find(item => item.productId === productId);
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({ productId, name, price, quantity });
  }
  
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";
  
  let subtotal = 0;
  cart.forEach(item => {
    const total = item.price * item.quantity;
    subtotal += total;
    
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <p>${item.name}</p>
      <p>Quantidade: ${item.quantity}</p>
      <p>Total: R$${total.toFixed(2)}</p>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  document.getElementById("subtotal").textContent = `R$${subtotal.toFixed(2)}`;
  document.getElementById("total").textContent = `R$${subtotal.toFixed(2)}`;
}

function clearCart() {
  cart = [];
  updateCartDisplay();
}

async function placeOrder() {
  if (cart.length === 0) {
    alert("O carrinho está vazio.");
    return;
  }

  const orderData = {
    date: new Date().toISOString(),
    items: cart,
    total: document.getElementById("total").textContent
  };

  const response = await fetch(ORDERS_SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  });

  if (response.ok) {
    alert("Pedido enviado com sucesso!");
    clearCart();

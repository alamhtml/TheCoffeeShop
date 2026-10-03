"use strict";

const CART_KEY = "coffeeShopCart";
const LEGACY_TOTAL_KEY = "cartTotal";

function getCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter(item =>
      item &&
      typeof item.name === "string" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      Number.isInteger(item.price) &&
      item.price >= 0
    );
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cartTotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function formatPrice(pence) {
  return (pence / 100).toFixed(2);
}

function renderCart() {
  const cart = getCart();
  const total = cartTotal(cart);
  const totalDisplay = document.getElementById("cart-total");
  if (totalDisplay) totalDisplay.textContent = formatPrice(total);

  const finalTotal = document.getElementById("final-total");
  if (finalTotal) finalTotal.textContent = formatPrice(total);

  const basketItems = document.getElementById("basket-items");
  if (basketItems) {
    basketItems.replaceChildren();
    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "basket-item";

      const details = document.createElement("div");
      details.className = "basket-item-details";
      const name = document.createElement("strong");
      name.textContent = item.name;
      const price = document.createElement("span");
      price.textContent = `£${formatPrice(item.price)} each`;
      details.append(name, price);

      const controls = document.createElement("div");
      controls.className = "quantity-controls";
      controls.setAttribute("aria-label", `${item.name} quantity`);
      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.textContent = "−";
      decrease.setAttribute("aria-label", `Remove one ${item.name}`);
      decrease.dataset.cartAction = "decrease";
      decrease.dataset.itemName = item.name;
      const quantity = document.createElement("span");
      quantity.textContent = item.quantity;
      quantity.setAttribute("aria-live", "polite");
      const increase = document.createElement("button");
      increase.type = "button";
      increase.textContent = "+";
      increase.setAttribute("aria-label", `Add one ${item.name}`);
      increase.dataset.cartAction = "increase";
      increase.dataset.itemName = item.name;
      controls.append(decrease, quantity, increase);

      const lineTotal = document.createElement("strong");
      lineTotal.className = "basket-line-total";
      lineTotal.textContent = `£${formatPrice(item.price * item.quantity)}`;
      row.append(details, controls, lineTotal);
      basketItems.append(row);
    });

    const emptyBasket = document.getElementById("empty-basket");
    if (emptyBasket) emptyBasket.hidden = cart.length !== 0;
    const confirmOrder = document.getElementById("confirm-order");
    if (confirmOrder) confirmOrder.disabled = cart.length === 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Discard the old total-only format: it has no product details to restore.
  if (!localStorage.getItem(CART_KEY)) localStorage.removeItem(LEGACY_TOTAL_KEY);
  renderCart();

  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const pricePence = Math.round(Number(button.dataset.price) * 100);
      if (!name || !Number.isSafeInteger(pricePence) || pricePence <= 0) return;

      const cart = getCart();
      const existing = cart.find(item => item.name === name && item.price === pricePence);
      if (existing) existing.quantity += 1;
      else cart.push({ name, price: pricePence, quantity: 1 });
      saveCart(cart);
      renderCart();

      const feedback = document.querySelector(".cart-feedback");
      if (feedback) feedback.textContent = `${name} added to your basket.`;
    });
  });

  const basketItems = document.getElementById("basket-items");
  if (basketItems) {
    basketItems.addEventListener("click", event => {
      const button = event.target.closest("button[data-cart-action]");
      if (!button) return;
      const cart = getCart();
      const item = cart.find(entry => entry.name === button.dataset.itemName);
      if (!item) return;
      if (button.dataset.cartAction === "increase") item.quantity += 1;
      else item.quantity -= 1;
      saveCart(cart.filter(entry => entry.quantity > 0));
      renderCart();
    });
  }

  const orderType = document.getElementById("order-type");
  const deliveryFields = document.getElementById("delivery-fields");
  const address = document.getElementById("address");
  const postcode = document.getElementById("postcode");
  if (orderType && deliveryFields) {
    orderType.addEventListener("change", () => {
      const deliverySelected = orderType.value === "delivery";
      deliveryFields.hidden = !deliverySelected;
      address.required = deliverySelected;
      postcode.required = deliverySelected;
    });
  }

  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", event => {
      event.preventDefault();
      const cart = getCart();
      const feedback = document.getElementById("order-feedback");
      if (!cart.length) {
        feedback.textContent = "Add an item to your basket before placing an order.";
        return;
      }
      if (!orderForm.reportValidity()) return;

      feedback.textContent = "Your details look good. This demo does not send orders to the shop yet, so your basket is saved here for you to place in person.";
    });
  }

  document.querySelectorAll("[data-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
  });
});

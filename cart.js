
// let cartTotal = 0;

// document.addEventListener("DOMContentLoaded", () => {
//   const cartDisplay = document.getElementById("cart-total");

//   document.querySelectorAll(".add-to-cart").forEach(button => {
//     button.addEventListener("click", () => {
//       const price = parseFloat(button.getAttribute("data-price"));
//       cartTotal += price;
//       cartDisplay.textContent = cartTotal.toFixed(2);
//     });
//   });
// });
// const onlinePayment = document.getElementById("online-payment");

// paymentMethod.addEventListener("change", () => {
//   onlinePayment.classList.toggle("hidden", paymentMethod.value !== "card");
// });

// document.getElementById("pay-online").addEventListener("click", async () => {
//   const stripe = stripe("pk_test_YOUR_PUBLIC_KEY"); // Replace with your Stripe public key

//   const response = await fetch("/create-checkout-session", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ amount: parseFloat(total) * 100 }) // amount in pence
//   });

//   const session = await response.json();
//   await stripe.redirectToCheckout({ sessionId: session.id });
// });



// document.addEventListener("DOMContentLoaded", () => {
// const cartDisplay = document.getElementById("cart-total");
// let cartTotal = parseFloat(localStorage.getItem("cartTotal")) || 0;
// cartDisplay.textContent = cartTotal.toFixed(2);

//   document.querySelectorAll(".add-to-cart").forEach(button => {
//     button.addEventListener("click", () => {
// const price = parseFloat(button.getAttribute("data-price"));
//     cartTotal += price;
//     localStorage.setItem("cartTotal", cartTotal.toFixed(2));
//       cartDisplay.textContent = cartTotal.toFixed(2);
//     });
//   });
// });


// let cart = JSON.parse(localStorage.getItem("cart")) || [];
// let total = cart.reduce((sum, item) => sum + item.price, 0);
// document.querySelector(".cart-total").textContent = `£ ${total.toFixed(2)}`;

// // cart.js
// function updateCartTotal(amount) {
//   let currentTotal = parseFloat(localStorage.getItem("cartTotal")) || 0;
//   currentTotal += amount;
//   localStorage.setItem("cartTotal", currentTotal.toFixed(2));
//   document.getElementById("cart-total").textContent = currentTotal.toFixed(2);
// }

// function loadCartTotal() {
//   const total = localStorage.getItem("cartTotal") || "0.00";
//   document.getElementById("cart-total").textContent = total;
// }

// window.onload = loadCartTotal;


// cart.js

// Load cart total on page load
// window.onload = function () {
//   loadCartTotal();
//   attachAddToCartListeners();
// };

// // Load the cart total from localStorage
// function loadCartTotal() {
//   const total = localStorage.getItem("cartTotal") || "0.00";
//   const cartDisplay = document.getElementById("cart-total");
//   if (cartDisplay) {
//     cartDisplay.textContent = total;
//   }
// }

// // Update the cart total and save to localStorage
// function updateCartTotal(amount) {
//   let currentTotal = parseFloat(localStorage.getItem("cartTotal")) || 0;
//   currentTotal += amount;
//   const newTotal = currentTotal.toFixed(2);
//   localStorage.setItem("cartTotal", newTotal);

//   const cartDisplay = document.getElementById("cart-total");
//   if (cartDisplay) {
//     cartDisplay.textContent = newTotal;
//   }
// }

// // Attach click listeners to all "Add to Cart" buttons
// function attachAddToCartListeners() {
//   const buttons = document.querySelectorAll("button, input[type='button']");
//   buttons.forEach(button => {
//     if (button.textContent.includes("Add to Cart") || button.value.includes("Add to Cart")) {
//       button.addEventListener("click", () => {
//         const priceText = button.previousSibling.textContent || button.parentElement.textContent;
//         const priceMatch = priceText.match(/£([0-9]+(?:\\.[0-9]{1,2})?)/);
//         if (priceMatch) {
//           const price = parseFloat(priceMatch[1]);
//           updateCartTotal(price);
//         }
//       });
//     }
//   });
// }


// Load cart total on page load
document.addEventListener("DOMContentLoaded", () => {
  const cartDisplay = document.getElementById("cart-total");
  let cartTotal = parseFloat(localStorage.getItem("cartTotal")) || 0;
  if (cartDisplay) {
    cartDisplay.textContent = cartTotal.toFixed(2);
  }

  // Add to Cart button logic
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const price = parseFloat(button.getAttribute("data-price"));
      cartTotal += price;
      localStorage.setItem("cartTotal", cartTotal.toFixed(2));
      if (cartDisplay) {
        cartDisplay.textContent = cartTotal.toFixed(2);
      }
    });
  });

  // Payment method toggle
  const paymentMethod = document.getElementById("payment-method");
  const onlinePayment = document.getElementById("online-payment");
  if (paymentMethod && onlinePayment) {
    paymentMethod.addEventListener("change", () => {
      onlinePayment.classList.toggle("hidden", paymentMethod.value !== "card");
    });
  }

  // Stripe payment logic
  const payOnlineBtn = document.getElementById("pay-online");
  if (payOnlineBtn) {
    payOnlineBtn.addEventListener("click", async () => {
      const stripe = Stripe("pk_test_YOUR_PUBLIC_KEY"); // Replace with your Stripe public key
      const amount = parseFloat(localStorage.getItem("cartTotal")) || 0;

      const response = await fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amount * 100) }) // amount in pence
      });

      const session = await response.json();
      await stripe.redirectToCheckout({ sessionId: session.id });
    });
  }
});

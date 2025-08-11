// server.js
const express = require("express");
const app = express();
const stripe = require("stripe")("sk_test_YOUR_SECRET_KEY"); // Replace with your Stripe secret key

app.use(express.static("public")); // Serve your HTML files from a 'public' folder
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "gbp",
        product_data: {
          name: "MY Coffee Order"
        },
        unit_amount: req.body.amount, // amount in pence
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: "http://127.0.0.1:5500/success.html",
    cancel_url: "http://127.0.0.1:5500/checkout.html",
  });

  res.json({ id: session.id });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));


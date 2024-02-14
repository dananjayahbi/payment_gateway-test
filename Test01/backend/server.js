const express = require("express");
const app = express();
const cors = require("cors");
// Replace if using a different env file or config
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());
app.use(express.json());
port = process.env.PORT || 8080;

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.static(process.env.STATIC_DIR));

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

//01. For PaymentIntent method to create a new PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const amount = req.body.amount * 100; // Convert to cents

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

//02. For Checkout method to create a new Checkout Session and redirect to Checkout page on success
app.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "USD",
      product_data: {
        name: product.dish,
        images: [product.imgdata],
      },
      unit_amount: product.price * 100,
    },
    quantity: product.qnty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:5173/PaymentSuccess",
    cancel_url: "http://localhost:5173/PaymentCancelled",
  });

  res.json({ id: session.id });
});

app.listen(port, () =>
  console.log(`Node server listening at http://localhost:${port}`)
);

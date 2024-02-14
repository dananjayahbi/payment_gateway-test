const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.PORT,
  });
});

console.log('process.env.PORT:', process.env.PORT);

// Handle POST request to create a payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    // const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: 'USD',
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.status.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ error: 'Could not create payment intent' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

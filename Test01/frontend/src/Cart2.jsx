import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./tests/CheckoutForm";

const stripe = loadStripe(
  "pk_test_51OTAJ6JdT2d2FGFUrkqKR0reQ3Ctgx4FKVq3ZSlqltbT4S2xnFi3AzE9r71rsZA5Aw0aNLPJYS0J28ZcjWjhyWiu00Wp3AS9HT"
);

const Cart = () => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  const body = {
    products: [
      {
        dish: "Pizza",
        imgdata: "https://example.com/pizza.jpg",
        price: 10,
        qnty: 2,
      },
      {
        dish: "Burger",
        imgdata: "https://example.com/burger.jpg",
        price: 5,
        qnty: 3,
      },
    ],
  };

  // Payment integration
  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51OTAJ6JdT2d2FGFUrkqKR0reQ3Ctgx4FKVq3ZSlqltbT4S2xnFi3AzE9r71rsZA5Aw0aNLPJYS0J28ZcjWjhyWiu00Wp3AS9HT"
    );

    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(
      "http://localhost:5000/create-checkout-session",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error.message);
    }
  };

  return (
    <>
      <div>
        <Elements stripe={stripe}>
          <AddressElement options={{ mode: "shipping" }}></AddressElement>
        </Elements>
        <button onClick={makePayment} className="btn btn-primary">
          CHECKOUT
        </button>
      </div>
    </>
  );
};

export default Cart;

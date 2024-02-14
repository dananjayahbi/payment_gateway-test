import React from 'react'
import "./App.css";
import Cart from './Cart';
import Cart2 from './Cart2';
import PaymentSuccess from './PaymentSuccess';
import PaymentCancelled from './PaymentCancelled';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/Cart2" element={<Cart2 />} />
        <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
        <Route path="/PaymentCancelled" element={<PaymentCancelled />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
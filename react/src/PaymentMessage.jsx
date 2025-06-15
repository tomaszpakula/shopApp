import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useCarts from "./useCarts";

export default function PaymentMessage() {
  const location = useLocation();
  const message = location.state?.message || "Something went wrong ...";
  const { clearCart } = useCarts();
  useEffect(() => {
    if (message === "Payment successful!") {
      clearCart();
    }
  }, []);

  return (
    <>
      <div data-testid="payment-message">{message}</div>
      <p data-testid="back-to-shop">
        <Link to="/">Back to shop</Link>
      </p>
    </>
  );
}

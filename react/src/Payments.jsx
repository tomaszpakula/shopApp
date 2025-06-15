import React, { useState } from "react";
import "./App.css";
import usePayments from "./usePayments";

export default function Payments() {
  const [msg, setMsg] = useState("");
  const cardNumber = React.useRef(null);
  const cardHolder = React.useRef(null);
  const expirationDate = React.useRef(null);
  const cvv = React.useRef(null);

  const { sendPayment } = usePayments();

  return (
    <div id="payments">
      <h1>Payments</h1>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          height: "70vh",
          justifyContent: "space-around",
          minWidth: "25vw",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          sendPayment(cardNumber, cardHolder, expirationDate, cvv, setMsg);
        }}
      >
        <input
          type="text"
          data-testid="card-number"
          placeholder="Card Number (4 digits)"
          ref={cardNumber}
        />
        <input
          type="text"
          data-testid="card-holder"
          placeholder="Card Holder"
          ref={cardHolder}
        />
        <input
          type="text"
          data-testid="exp-date"
          placeholder="Expiration Date"
          ref={expirationDate}
          title="Format: MM/YY"
        />
        <input
          type="text"
          data-testid="cvv"
          placeholder="CVV (3 digits)"
          ref={cvv}
        />
        <button data-testid="final-pay-button">Pay</button>
      </form>
      {msg && <h2 data-testid="payment-msg">{msg}</h2>}
    </div>
  );
}

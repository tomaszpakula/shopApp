import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function usePayments() {
  const navigate = useNavigate();
  const sendPayment = (cardNumber, cardHolder, expirationDate, cvv, setMsg) => {
    if (!/^\d{4}$/.test(cardNumber.current.value)) {
      setMsg("Card number must be exactly 4 digits.");
      return;
    }
    if (cardHolder.current.value.length < 3) {
      setMsg("Card holder name is too short.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expirationDate.current.value)) {
      setMsg("Expiration date must be in format MM/YY.");
      return;
    }
    if (!/^\d{3}$/.test(cvv.current.value)) {
      setMsg("CVV must be exactly 3 digits.");
      return;
    }

    axios("http://localhost:9000/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        cardNumber: cardNumber.current.value,
        cardHolder: cardHolder.current.value,
        expirationDate: expirationDate.current.value,
        cvv: cvv.current.value,
      },
    })
      .then((response) => {
        navigate("/message", { state: { message: "Payment successful!" } });
        return response;
      })
      .catch((error) => {
        navigate("/message", { state: { message: "Something went wrong!" } });
      });
  };
  return { sendPayment };
}

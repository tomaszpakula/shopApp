import React from "react";
import "./App.css";
import useCarts from "./useCarts";
import PropTypes from "prop-types";

export default function CartItem({ name, item }) {
  const { removeItem } = useCarts();
  return (
    <div className="cartItem" data-testid="cart-item">
      <h2>{name}</h2>
      <p>quantity: {item.quantity}</p>
      <button
        onClick={() => removeItem(item.productId)}
        data-testid="remove-item"
      >
        Remove
      </button>
    </div>
  );
}

CartItem.propTypes = {
  name: PropTypes.string.isRequired,
  item: PropTypes.shape({
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};
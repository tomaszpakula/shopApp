import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import useCarts from "./useCarts";
import PropTypes from "prop-types";

export default function Product({ product }) {
  const [quantity, setQuantity] = useState(0);
  const { addToCart } = useCarts();

  return (
    <div
      data-testid="product"
      style={{
        border: "1px solid #555",
        borderRadius: "0.6rem",
        padding: "1rem",
      }}
    >
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <button
          data-testid="decrease"
          disabled={quantity === 0}
          onClick={() => {
            setQuantity((prev) => prev - 1);
          }}
        >
          -
        </button>
        <div
          data-testid="quantity"
          style={{
            maxWidth: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #333",
            borderTadius: "0.5rem",
            minWidth: "3rem",
          }}
        >
          {quantity}
        </div>
        <button
          data-testid="increase"
          onClick={() => {
            setQuantity((prev) => prev + 1);
          }}
        >
          +
        </button>
        <FontAwesomeIcon
          data-testid="add-to-cart"
          icon={faCartShopping}
          className="cart"
          onClick={() => {
            addToCart(product.id, quantity);
            setQuantity(0);
          }}
        />
      </div>
    </div>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    price: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
};
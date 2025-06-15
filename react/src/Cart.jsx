import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "./ProductContext";
import CartItem from "./CartItem";
import "./App.css";
import useCarts from "./useCarts";

export default function Cart() {
  const { items } = useContext(ProductContext);
  const { products } = useContext(ProductContext);
  const { clearCart } = useCarts();
  return (
    <div id="cartItems">
      <h1>Cart Items</h1>
      {items.length === 0 ? (
        <h2 data-testid="empty-cart-msg">Empty cart</h2>
      ) : (
        ""
      )}
      {items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return (
          <>
            {product ? (
              <CartItem name={product.name} item={item} key={item.id} />
            ) : (
              ""
            )}
          </>
        );
      })}
      <button
        data-testid="clear-cart-button"
        disabled={items.length === 0}
        onClick={() => {
          clearCart();
        }}
      >
        Clear Cart
      </button>
      <Link to="/payments">
        <button data-testid="pay-button" disabled={items.length === 0}>
          Pay
        </button>
      </Link>
    </div>
  );
}

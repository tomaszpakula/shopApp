import React, { useContext } from "react";
import Product from "./Product";
import { ProductContext } from "./ProductContext";

export default function Products() {
  const { products } = useContext(ProductContext);
  return (
    <div id="products">
      <h1>Products</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {products.map((product) => (
          <Product product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

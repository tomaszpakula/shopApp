import axios from "axios";
import axiosRetry from "axios-retry";
import React, { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";

export const ProductContext = createContext();

axiosRetry(axios, {
  retries: 20,
  retryDelay: axiosRetry.exponentialDelay,
});

export const ProductProvider = ({ children }) => {
  const [cartChange, setCartChange] = useState(false);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [errorProductMessage, setErrorProductMessage] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:9000/products", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setErrorProductMessage("");
        setProducts(response.data);
      })
      .catch((err) => {
        console.log("error", err);
        setErrorProductMessage("Nie udało się załadować produktów");
      });
  }, []);

  useEffect(() => {
    axios("http://localhost:9000/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setItems(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cartChange]);

  const value = useMemo(() => ({
    products,
    setProducts,
    items,
    setItems,
    errorProductMessage,
    setCartChange,
  }), [products, items, errorProductMessage, setProducts, setItems, setCartChange]);
  

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
ProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "../Cart";
import { ProductContext } from "../ProductContext";
import * as cartsHook from "../useCarts";
import { BrowserRouter } from "react-router-dom";

describe("Cart component", () => {
  const clearCartMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(cartsHook, "default").mockReturnValue({
      clearCart: clearCartMock,
      removeItem: vi.fn(),
      addToCart: vi.fn(),
    });
  });

  it("renders empty cart message when no items", () => {
    render(
      <ProductContext.Provider value={{ items: [], products: [] }}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </ProductContext.Provider>
    );

    expect(screen.getByTestId("empty-cart-msg")).toHaveTextContent("Empty cart");
    expect(screen.getByTestId("clear-cart-button")).toBeDisabled();
    expect(screen.getByTestId("pay-button")).toBeDisabled();
  });

  it("renders CartItem components for each cart item", () => {
    const items = [
      { id: 1, productId: 1, quantity: 2 },
      { id: 2, productId: 2, quantity: 1 },
    ];
    const products = [
      { id: 1, name: "Laptop", price: 999 },
      { id: 2, name: "Mouse", price: 20 },
    ];

    render(
      <ProductContext.Provider value={{ items, products }}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </ProductContext.Provider>
    );

    const cartItems = screen.getAllByTestId("cart-item");
    expect(cartItems.length).toBe(2);
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Mouse")).toBeInTheDocument();
  });

  it("does not render CartItem if product is missing", () => {
    const items = [{ id: 1, productId: 3, quantity: 2 }];
    const products = [{ id: 1, name: "Laptop", price: 999 }];

    render(
      <ProductContext.Provider value={{ items, products }}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </ProductContext.Provider>
    );

    expect(screen.queryByTestId("cart-item")).not.toBeInTheDocument();
  });

  it("clear cart button calls clearCart function", () => {
    const items = [{ id: 1, productId: 1, quantity: 1 }];
    const products = [{ id: 1, name: "Laptop", price: 999 }];

    render(
      <ProductContext.Provider value={{ items, products }}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </ProductContext.Provider>
    );

    const clearBtn = screen.getByTestId("clear-cart-button");
    expect(clearBtn).not.toBeDisabled();

    fireEvent.click(clearBtn);
    expect(clearCartMock).toHaveBeenCalled();
  });

  it("pay button is enabled only when there are items", () => {
    const { rerender } = render(
      <ProductContext.Provider value={{ items: [], products: [] }}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </ProductContext.Provider>
    );

    const payBtn = screen.getByTestId("pay-button");
    expect(payBtn).toBeDisabled();

    const items = [{ id: 1, productId: 1, quantity: 1 }];
    const products = [{ id: 1, name: "Laptop", price: 999 }];

    rerender(
      <ProductContext.Provider value={{ items, products }}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </ProductContext.Provider>
    );

    expect(screen.getByTestId("pay-button")).not.toBeDisabled();
  });
});

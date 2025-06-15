import { render, screen } from "@testing-library/react";
import Product from "../Product";
import React from "react";
import { ProductContext } from "../ProductContext";
import userEvent from "@testing-library/user-event";
import * as cartsHook from "../useCarts";

describe("Product component", () => {
  const product = {
    id: 1,
    name: "Laptop",
    price: 999,
  };

  const mockContext = {
    items: [],
    setItems: vi.fn(),
    setCartChange: vi.fn(),
  };

  const addToCartMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(cartsHook, "default").mockReturnValue({
      addToCart: addToCartMock,
      clearCart: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it("renders product name, price, buttons, and initial quantity", () => {
    render(
      <ProductContext.Provider value={mockContext}>
        <Product product={product} />
      </ProductContext.Provider>
    );

    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("$999")).toBeInTheDocument();

    const increaseBtn = screen.getByTestId("increase");
    const decreaseBtn = screen.getByTestId("decrease");
    expect(increaseBtn).toBeInTheDocument();
    expect(decreaseBtn).toBeInTheDocument();

    expect(screen.getByTestId("quantity")).toHaveTextContent("0");
    expect(decreaseBtn).toBeDisabled();

    const addIcon = screen.getByTestId("add-to-cart");
    expect(addIcon).toBeInTheDocument();
    expect(addIcon).toHaveClass("cart");
  });

  it("increase button increments quantity and decrease enables", async () => {
    render(
      <ProductContext.Provider value={mockContext}>
        <Product product={product} />
      </ProductContext.Provider>
    );

    const increaseBtn = screen.getByTestId("increase");
    const decreaseBtn = screen.getByTestId("decrease");
    const quantityDisplay = screen.getByTestId("quantity");

    await userEvent.click(increaseBtn);
    await userEvent.click(increaseBtn);

    expect(quantityDisplay).toHaveTextContent("2");
    expect(decreaseBtn).not.toBeDisabled();

    await userEvent.click(increaseBtn);
    expect(quantityDisplay).toHaveTextContent("3");
  });

  it("decrease button decrements quantity but not below 0", async () => {
    render(
      <ProductContext.Provider value={mockContext}>
        <Product product={product} />
      </ProductContext.Provider>
    );

    const increaseBtn = screen.getByTestId("increase");
    const decreaseBtn = screen.getByTestId("decrease");
    const quantityDisplay = screen.getByTestId("quantity");

    expect(quantityDisplay).toHaveTextContent("0");
    expect(decreaseBtn).toBeDisabled();

    await userEvent.click(increaseBtn); // quantity = 1
    expect(quantityDisplay).toHaveTextContent("1");
    expect(decreaseBtn).not.toBeDisabled();

    await userEvent.click(decreaseBtn); // quantity = 0
    expect(quantityDisplay).toHaveTextContent("0");
    expect(decreaseBtn).toBeDisabled();

    await userEvent.click(decreaseBtn);
    expect(quantityDisplay).toHaveTextContent("0");
  });

  it("clicking add-to-cart calls addToCart with correct args and resets quantity", async () => {
    render(
      <ProductContext.Provider value={mockContext}>
        <Product product={product} />
      </ProductContext.Provider>
    );

    const increaseBtn = screen.getByTestId("increase");
    const addToCartBtn = screen.getByTestId("add-to-cart");
    const quantityDisplay = screen.getByTestId("quantity");

    await userEvent.click(increaseBtn);
    await userEvent.click(increaseBtn);
    expect(quantityDisplay).toHaveTextContent("2");

    await userEvent.click(addToCartBtn);
    expect(addToCartMock).toHaveBeenCalledTimes(1);
    expect(addToCartMock).toHaveBeenCalledWith(product.id, 2);

    expect(quantityDisplay).toHaveTextContent("0");
    expect(screen.getByTestId("decrease")).toBeDisabled();
    expect(addToCartBtn).not.toBeDisabled
  });
});

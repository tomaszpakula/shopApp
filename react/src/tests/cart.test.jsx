import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Cart from '../Cart'
import { ProductContext } from '../ProductContext'
import * as cartsHook from '../useCarts'
import { BrowserRouter } from 'react-router-dom'

describe('Cart component', () => {
  const mockClearCart = vi.fn()

  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 499 }
  ]

  const items = [
    { id: 101, productId: 1, quantity: 2 },
    { id: 102, productId: 2, quantity: 1 }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(cartsHook, 'default').mockReturnValue({
      clearCart: mockClearCart,
      addToCart: vi.fn(),
      removeItem: vi.fn(),
    })
  })

  function renderCart(customItems = items, customProducts = products) {
    return render(
      <ProductContext.Provider value={{ items: customItems, products: customProducts }}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </ProductContext.Provider>
    )
  }

  it('renders heading and buttons', () => {
    renderCart()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Cart Items')
    expect(screen.getByTestId('clear-cart-button')).toBeInTheDocument()
    expect(screen.getByTestId('pay-button')).toBeInTheDocument()
  })

  it('shows "Empty cart" message when cart is empty', () => {
    renderCart([], products)

    expect(screen.getByTestId('empty-cart-msg')).toBeInTheDocument()
    expect(screen.getByTestId('empty-cart-msg')).toHaveTextContent('Empty cart')
  })

  it('disables clear and pay buttons when cart is empty', () => {
    renderCart([], products)

    expect(screen.getByTestId('clear-cart-button')).toBeDisabled()
    expect(screen.getByTestId('pay-button')).toBeDisabled()
  })

  it('enables clear and pay buttons when cart has items', () => {
    renderCart()

    expect(screen.getByTestId('clear-cart-button')).not.toBeDisabled()
    expect(screen.getByTestId('pay-button')).not.toBeDisabled()
  })

  it('renders CartItem components for each cart item with correct props', () => {
    renderCart()

    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
  })

  it('does not render CartItem if product for item not found', () => {
    const itemsWithUnknownProduct = [{ id: 200, productId: 999, quantity: 1 }]
    renderCart(itemsWithUnknownProduct, products)

    expect(screen.queryByText('Laptop')).not.toBeInTheDocument()
    expect(screen.queryByText('Phone')).not.toBeInTheDocument()
  })

  it('calls clearCart when Clear Cart button is clicked', () => {
    renderCart()

    const clearButton = screen.getByTestId('clear-cart-button')
    fireEvent.click(clearButton)
    expect(mockClearCart).toHaveBeenCalledTimes(1)
  })

  it('contains a Pay button linking to /payments', () => {
    renderCart()

    const payButton = screen.getByTestId('pay-button')
    expect(payButton.closest('a')).toHaveAttribute('href', '/payments')
  })



})

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CartItem from '../CartItem'
import * as cartsHook from '../useCarts'

describe('CartItem component', () => {
  const removeItemMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(cartsHook, 'default').mockReturnValue({
      removeItem: removeItemMock,
    })
  })

  const item = { productId: 1, quantity: 3 }
  const name = 'Laptop'

  it('renders container, product name, and quantity', () => {
    render(<CartItem name={name} item={item} />)

    const container = screen.getByTestId('cart-item')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('cartItem')

    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('quantity: 3')).toBeInTheDocument()
  })

  it('renders remove button with correct attributes', () => {
    render(<CartItem name={name} item={item} />)

    const removeBtn = screen.getByTestId('remove-item')
    expect(removeBtn).toBeInTheDocument()
    expect(removeBtn).toHaveTextContent('Remove')
    expect(removeBtn).toBeEnabled()
    expect(removeBtn.tagName).toBe('BUTTON')
  })

  it('calls removeItem with productId when remove button clicked', () => {
    render(<CartItem name={name} item={item} />)

    const removeBtn = screen.getByTestId('remove-item')
    fireEvent.click(removeBtn)

    expect(removeItemMock).toHaveBeenCalledTimes(1)
    expect(removeItemMock).toHaveBeenCalledWith(1)
  })
})

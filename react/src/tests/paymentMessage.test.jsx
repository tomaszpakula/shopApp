import { render, screen } from '@testing-library/react'
import PaymentMessage from '../PaymentMessage'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import * as cartsHook from '../useCarts'

describe('PaymentMessage component', () => {
  const clearCartMock = vi.fn()

  beforeEach(() => {
    vi.spyOn(cartsHook, 'default').mockReturnValue({ clearCart: clearCartMock })
  })

  it('renders success message and calls clearCart', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/message', state: { message: 'Payment successful!' } }]}>
        <PaymentMessage />
      </MemoryRouter>
    )
    expect(screen.getByTestId('payment-message')).toHaveTextContent('Payment successful!')
    expect(screen.getByTestId('back-to-shop')).toBeInTheDocument()
    expect(clearCartMock).toHaveBeenCalled()
  })

  it('renders fallback message if state is missing', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/message' }]}>
        <PaymentMessage />
      </MemoryRouter>
    )
    expect(screen.getByTestId('payment-message')).toHaveTextContent('Something went wrong')
  })
})

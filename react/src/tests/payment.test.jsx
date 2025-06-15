import { render, screen } from '@testing-library/react'
import React from 'react'
import Payments from '../Payments'
import userEvent from '@testing-library/user-event'
import * as paymentHook from '../usePayments'

describe('Payments component', () => {
  const sendPaymentMock = vi.fn()

  beforeEach(() => {
    vi.spyOn(paymentHook, 'default').mockReturnValue({ sendPayment: sendPaymentMock })
  })

  it('renders all inputs and submit button', () => {
    render(<Payments />)

    expect(screen.getByTestId('card-number')).toBeInTheDocument()
    expect(screen.getByTestId('card-holder')).toBeInTheDocument()
    expect(screen.getByTestId('exp-date')).toBeInTheDocument()
    expect(screen.getByTestId('cvv')).toBeInTheDocument()
    expect(screen.getByTestId('final-pay-button')).toBeInTheDocument()
  })

  it('calls sendPayment with valid input', async () => {
    render(<Payments />)

    await userEvent.type(screen.getByTestId('card-number'), '1234')
    await userEvent.type(screen.getByTestId('card-holder'), 'John Doe')
    await userEvent.type(screen.getByTestId('exp-date'), '12/25')
    await userEvent.type(screen.getByTestId('cvv'), '123')

    await userEvent.click(screen.getByTestId('final-pay-button'))

    expect(sendPaymentMock).toHaveBeenCalled()
  })
})

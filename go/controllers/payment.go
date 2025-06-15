package controllers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"zadanie4/models"
)

type PaymentController struct{}

func (pc *PaymentController) Validate(c echo.Context) error {
	var payment models.Payment

	if err := c.Bind(&payment); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Payment Failed"})
	}

	if len(payment.CardNumber) == 4 && len(payment.CVV) == 3 {
		return c.JSON(http.StatusOK, echo.Map{"status": "valid"})
	}

	return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid card number or CVV"})
}

package models

type Payment struct {
	CardNumber string `json:"cardNumber"`
	CVV        string `json:"cvv"`
}

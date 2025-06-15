package controllers

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"zadanie4/models"
)

type CartController struct {
	DB *gorm.DB
}

func (cc *CartController) AddToCart(c echo.Context) error {
	var cartProduct models.Cart

	if err := c.Bind(&cartProduct); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid input"})
	}

	var existingProduct models.Cart
	err := cc.DB.Where("product_id = ?", cartProduct.ProductID).First(&existingProduct).Error
	if err == nil {
		existingProduct.Quantity += cartProduct.Quantity
		if err := cc.DB.Save(&existingProduct).Error; err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to update product quantity"})
		}
		return c.JSON(http.StatusOK, existingProduct)
	}
	if err := cc.DB.Create(&cartProduct).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to add product"})
	}

	return c.JSON(http.StatusCreated, cartProduct)
}

func (cc *CartController) GetAllProducts(c echo.Context) error {
	var cartProducts []models.Cart
	relation := c.QueryParam("relation")
	quantity := c.QueryParam("quantity")

	dbQuery := cc.DB.Model(&models.Cart{})

	if quantityVal, err := strconv.Atoi(quantity); err == nil {
		dbQuery = dbQuery.Scopes(models.FilterByQuantity(relation, quantityVal))
	}

	if err := dbQuery.Find(&cartProducts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to get all products"})
	}

	return c.JSON(http.StatusOK, cartProducts)
}

func (cc *CartController) RemoveProduct(c echo.Context) error {
	productID := c.Param("id")
	var cartProduct models.Cart

	result := cc.DB.Where("product_id = ?", productID).Delete(&cartProduct)
	if result.RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Product not found"})
	}
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to remove product"})
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "Product removed"})
}

func (cc *CartController) UpdateQuantity(c echo.Context) error {
	productID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid product ID"})
	}

	var input struct {
		Quantity uint64 `json:"quantity"`
	}
	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid body format"})
	}
	if input.Quantity == 0 {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Quantity must be greater than 0"})
	}

	var cartItem models.Cart
	if err := cc.DB.Where("product_id = ?", productID).First(&cartItem).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Product not found"})
	}

	previous := cartItem.Quantity
	cartItem.Quantity = input.Quantity
	if err := cc.DB.Save(&cartItem).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to update quantity"})
	}

	return c.JSON(http.StatusOK, echo.Map{
		"message": "Updated quantity",
		"from":    previous,
		"to":      input.Quantity,
	})
}

func (cc *CartController) ClearCart(c echo.Context) error {
	if err := cc.DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&models.Cart{}).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to clear cart"})
	}
	return c.NoContent(http.StatusNoContent)
}

package controllers

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"zadanie4/models"
)

type ProductController struct {
	DB *gorm.DB
}

type ErrorResponse struct {
    Error string `json:"error"`
}

func (p *ProductController) CreateProduct(c echo.Context) error {
	var product models.Product
	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid input data"})
	}
	var category models.Category
	if err := p.DB.First(&category, product.CategoryID).Error; err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Category not found"})
	}
	if err := p.DB.Create(&product).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to create product"})
	}
	if err := p.DB.Preload("Category").First(&product, product.ID).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to load product with category"})
	}
	return c.JSON(http.StatusCreated, product)
}

func (p *ProductController) GetProducts(c echo.Context) error {
	sort := c.QueryParam("sort")
	column := c.QueryParam("column")
	id := c.QueryParam("id")

	if sort != "" && column == "" {
		column = "price"
	}

	var products []models.Product
	result := p.DB.Model(&models.Product{}).Preload("Category")

	if sort != "" {
		result = result.Scopes(models.SortByColumn(sort, column))
	}

	if id, err := strconv.Atoi(id); err == nil {
		result = result.Scopes(models.FilterByCategory(id))
	}

	if err := result.Find(&products).Error; err != nil {
		return err
	}
	if result.Error != nil {
		return result.Error
	}
	return c.JSON(http.StatusOK, products)
}

func (p *ProductController) GetProduct(c echo.Context) error {
	id := c.Param("id")
	var product models.Product
	if err := p.DB.First(&product, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, ErrorResponse{
            Error: err.Error(),
        })
	}
	return c.JSON(http.StatusOK, product)
}

func (p *ProductController) UpdateProduct(c echo.Context) error {
	id := c.Param("id")
	var product models.Product

	if err := p.DB.First(&product, id).Error; err != nil {
		return c.JSON(http.StatusNotFound,  echo.Map{"error": "Invalid input data"})
	}

	if err := c.Bind(&product); err != nil {
		return err
	}

	p.DB.Save(&product)
	return c.JSON(http.StatusOK, product)
}

func (p *ProductController) DeleteProduct(c echo.Context) error {
	id := c.Param("id")
	if err := p.DB.Delete(&models.Product{}, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, err)
	}
	return c.JSON(http.StatusOK, "Product deleted")
}

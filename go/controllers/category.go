package controllers

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"net/http"
	"zadanie4/models"
)

type CategoryController struct {
	DB *gorm.DB
}

func (cc *CategoryController) CreateCategory(c echo.Context) error {
	var category models.Category
	if err := c.Bind(&category); err != nil {
		return err
	}
	if result := cc.DB.Create(&category); result.Error != nil {
		return result.Error
	}
	return c.JSON(http.StatusCreated, category)
}

func (cc *CategoryController) GetCategories(c echo.Context) error {
	var categories []models.Category
	result := cc.DB.Model(&models.Category{})
	sort := c.QueryParam("sort")

	if sort != "" {
		result = result.Scopes(models.SortByCategory(sort))
	}

	result = result.Find(&categories)
	return c.JSON(http.StatusOK, categories)
}

func (cc *CategoryController) UpdateCategory(c echo.Context) error {
	id := c.Param("id")
	var category models.Category

	if err := cc.DB.First(&category, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Category not found"})
	}

	if err := c.Bind(&category); err != nil {
		return err
	}

	cc.DB.Save(&category)
	return c.JSON(http.StatusOK, category)
}

func (cc *CategoryController) DeleteCategory(c echo.Context) error {
	id := c.Param("id")
	var category models.Category

	if err := cc.DB.First(&category, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "Category not found"})
	}

	if err := cc.DB.Delete(&category).Error; err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

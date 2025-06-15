package models

import (
	"fmt"
	"strings"

	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	ID         uint     `gorm:"primaryKey" json:"id"`
	Name       string   `json:"name"`
	Price      float64  `json:"price"`
	CategoryID uint     `json:"categoryId"`
	Category   Category `json:"category"`
}

func SortByColumn(order string, column string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if column != "name" && column != "price" {
			return db
		}
		if order == "desc" || order == "asc" {
			return db.Order(fmt.Sprintf("%s %s", column, strings.ToUpper(order)))
		}
		return db
	}
}

func FilterByCategory(categoryID int) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if categoryID <= 0 {
			return db
		}

		return db.Where("category_id = ?", categoryID)
	}
}

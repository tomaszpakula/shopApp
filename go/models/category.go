package models

import (
	"fmt"
	"gorm.io/gorm"
	"strings"
)

type Category struct {
	gorm.Model
	Name string `json:"name"`
}

func SortByCategory(order string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if order == "desc" || order == "asc" {
			return db.Order(fmt.Sprintf("name %s", strings.ToUpper(order)))
		}
		return db
	}
}

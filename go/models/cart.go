package models

import "gorm.io/gorm"

type Cart struct {
	gorm.Model
	ProductID uint64 `json:"productId"`
	Quantity  uint64 `json:"quantity"`
}

func FilterByQuantity(relation string, quantity int) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if quantity < 0 {
			return db
		}
		if relation == "greater" {
			return db.Where("quantity > ?", quantity)
		} else if relation == "lesser" {
			return db.Where("quantity < ?", quantity)
		} else if relation == "equal" {
			return db.Where("quantity = ?", quantity)
		}
		return db
	}

}

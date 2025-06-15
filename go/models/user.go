package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string `gorm:"uniqueIndex" json:"username"`
	Email string `gorm:"uniqueIndex" json:"email"`
	// Password is not stored in the database, but is used for authentication
	Password string `json:"-"`
}

package controllers

import (
	"fmt"
	"net/http"
	"strings"
	"time"
	"zadanie4/models"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthController struct {
	DB *gorm.DB
}

type RegisterInput struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (ac *AuthController) Register(c echo.Context) error {
	var input RegisterInput
	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid input"})
	}
	if input.Username == "" || input.Email == "" || input.Password == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "All fields are required"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Hashing password error"})
	}
	user := models.User{
		Username: input.Username,
		Email:    input.Email,
		Password: string(hashedPassword),
	}

	if err := ac.DB.Create(&user).Error; err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			return c.JSON(http.StatusBadRequest, echo.Map{
				"error": "Username or email already exists",
			})
		}
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Could not create user"})
	}

	return c.JSON(http.StatusCreated, echo.Map{"message": "User registered successfully"})
}

func (ac *AuthController) Login(c echo.Context) error {
	var input LoginInput
	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid output"})
	}

	var user models.User
	if err := ac.DB.Where("email=?", input.Email).First(&user).Error; err != nil {
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Invalid credentials"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Invalid credentials"})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), //72h
	})

	secret := "secret"

	tokenString, err := token.SignedString([]byte(secret))

	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to generate token"})
	}

	return c.JSON(http.StatusOK, echo.Map{"token": tokenString})
}

func (ac *AuthController) GetMe(c echo.Context) error {

	claims := c.Get("user").(jwt.MapClaims)

	userIDFLoat, ok := claims["user_id"].(float64)
	if !ok {
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Invalid token"})
	}
	userID := uint(userIDFLoat)

	var user models.User
	if err := ac.DB.First(&user, userID).Error; err != nil {
		fmt.Println("not found")
		fmt.Println(userID)
		return c.JSON(http.StatusNotFound, echo.Map{"error": "User with id not found"})
	}

	return c.JSON(http.StatusOK, echo.Map{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
	})

}

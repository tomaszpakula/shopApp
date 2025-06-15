package middlewares

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
)
func Verify(next echo.HandlerFunc) echo.HandlerFunc{
	return func(c echo.Context) error{
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
				fmt.Println("Missing Authorization Header")

			return echo.NewHTTPError(http.StatusUnauthorized, "Missing Authorization Header")
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			fmt.Println("Invalid Authorization Header Format")
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid Authorization Header Format")
		}

		secret := "secret"

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			fmt.Println("Invalid or expired token")
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid or expired token")
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			fmt.Println("Ivalid Token Claims")
			return echo.NewHTTPError(http.StatusUnauthorized, "Invalid token claims")
		}

		c.Set("user", claims)
		return next(c)

	}
}
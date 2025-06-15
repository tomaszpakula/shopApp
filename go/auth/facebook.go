package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"zadanie4/models"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
	"gorm.io/gorm"
)

var (
	facebookOauthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:9000/auth/facebook/callback",
		ClientID:     os.Getenv("FACEBOOK_CLIENT_ID"),
		ClientSecret: os.Getenv("FACEBOOK_CLIENT_SECRET"),
		Scopes:       []string{"email"},
		Endpoint:     facebook.Endpoint,
	}
)

type FacebookController struct {
	DB *gorm.DB
}

func (g *FacebookController) FacebookLogin(c echo.Context) error {
	facebookOauthConfig.ClientID = os.Getenv("FACEBOOK_CLIENT_ID")
	facebookOauthConfig.ClientSecret = os.Getenv("FACEBOOK_CLIENT_SECRET")
	url := facebookOauthConfig.AuthCodeURL("random-state")
	return c.Redirect(http.StatusTemporaryRedirect, url)
}

func (g *FacebookController) FacebookCallback(c echo.Context) error {
	code := c.QueryParam("code")
	token, err := facebookOauthConfig.Exchange(context.Background(), code)

	if err != nil {
		return c.String(http.StatusBadRequest, "could not get Facebook token")
	}

	client := facebookOauthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://graph.facebook.com/me?fields=id,name,email")
	if err != nil {
		return c.String(http.StatusBadRequest, "could not get Facebook user info")
	}
	defer resp.Body.Close()

	var userInfo struct {
		Email   string `json:"email"`
		Name    string `json:"name"`
	}
	json.NewDecoder(resp.Body).Decode(&userInfo)

	var user models.User
	result := g.DB.Where("email = ?", userInfo.Email).First(&user)
	if result.Error != nil {
		user = models.User{Email: userInfo.Email, Username: userInfo.Name}
		g.DB.Create(&user)
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
	}

	tokenJwt := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, _ := tokenJwt.SignedString(jwtSecret)
	fmt.Println("Przekierowanie...")
	return c.Redirect(http.StatusTemporaryRedirect, "http://localhost:5173/oauth/google?token="+signedToken)

}

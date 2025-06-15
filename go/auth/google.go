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
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"
)

var (
	googleOauthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:9000/auth/google/callback",
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}
	jwtSecret = []byte("secret")
)

type GoogleController struct {
	DB *gorm.DB
}

func (g *GoogleController) GoogleLogin(c echo.Context) error {
	googleOauthConfig.ClientID = os.Getenv("GOOGLE_CLIENT_ID")
	googleOauthConfig.ClientSecret = os.Getenv("GOOGLE_CLIENT_SECRET")
	url := googleOauthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	return c.Redirect(http.StatusTemporaryRedirect, url)
}

func (g *GoogleController) GoogleCallback(c echo.Context) error {
	code := c.QueryParam("code")
	token, err := googleOauthConfig.Exchange(context.Background(), code)

	if err != nil {
		return c.String(http.StatusBadRequest, "could not get Google token")
	}

	client := googleOauthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")

	if err != nil {
		return c.String(http.StatusBadRequest, "could not get Google user info")
	}
	var userInfo struct {
		Email   string `json:"email"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
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

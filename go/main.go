package main

import (
	"zadanie4/auth"
	"zadanie4/controllers"
	"zadanie4/middlewares"
	"zadanie4/models"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type App struct {
	DB *gorm.DB
}

func main() {
	godotenv.Load()
	db, err := gorm.Open(sqlite.Open("data.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	

	e := echo.New()
	//e.Use(middleware.Logger())
	/*e.Use(middleware.Logger())
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "${method} ${uri} -> ${status} | token=${header:Authorization}\n",
	}))*/

	db.AutoMigrate(&models.Product{}, &models.Category{}, &models.Cart{}, &models.User{})

	productController := &controllers.ProductController{DB: db}
	cartController := &controllers.CartController{DB: db}
	categoryController := &controllers.CategoryController{DB: db}
	paymentController := &controllers.PaymentController{}
	authController := &controllers.AuthController{DB: db}
	googleController := &auth.GoogleController{DB: db}
	facebookController := &auth.FacebookController{DB: db}

	e.GET("/auth/google/login", googleController.GoogleLogin)
	e.GET("/auth/google/callback", googleController.GoogleCallback)
	e.GET("/auth/facebook/login", facebookController.FacebookLogin)
	e.GET("/auth/facebook/callback", facebookController.FacebookCallback)

	e.GET("/me", authController.GetMe, middlewares.Verify)
	e.POST("/login", authController.Login)
	e.POST("/register", authController.Register)
	e.POST("/products", productController.CreateProduct)
	e.GET("/products", productController.GetProducts)
	e.GET("/products/:id", productController.GetProduct)
	e.PUT("/products/:id", productController.UpdateProduct)
	e.DELETE("/products/:id", productController.DeleteProduct)

	e.POST("/cart", cartController.AddToCart)
	e.GET("/cart", cartController.GetAllProducts)
	e.DELETE("/cart/:id", cartController.RemoveProduct)
	e.PUT("/cart/:id", cartController.UpdateQuantity)
	e.DELETE("/cart", cartController.ClearCart)

	e.POST("/categories", categoryController.CreateCategory)
	e.GET("/categories", categoryController.GetCategories)
	e.PUT("/categories/:id", categoryController.UpdateCategory)
	e.DELETE("/categories/:id", categoryController.DeleteCategory)

	e.POST("/validate", paymentController.Validate)

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.OPTIONS},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	e.Logger.Fatal(e.Start(":9000"))

}

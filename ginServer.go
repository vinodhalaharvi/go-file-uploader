package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"path/filepath"
)

type GinServer struct {
	Router *gin.Engine
	Store  *Store
}

type Store struct {
	// for dependency injection
}

// Ping ping handler
func (s *GinServer) Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Pong",
	})

}

func (s *GinServer) Upload(c *gin.Context) {
	// Multipart form
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	files := form.File["files"]

	for _, file := range files {
		filename := filepath.Base(file.Filename)
		filename = filepath.Join("static", filename)
		if err := c.SaveUploadedFile(file, filename); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}
	c.JSON(
		http.StatusOK,
		gin.H{
			"message": "Uploaded successfully",
			"files":   files,
		})
}

// Static static handler
func (s *GinServer) Static(c *gin.Context) {
	c.File("./static")
}

// LoadTemplates load templates
func (s *GinServer) LoadTemplates(c *gin.Context) {
	s.Router.LoadHTMLGlob("templates/*")
}

// Home home handler
func (s *GinServer) Home(c *gin.Context) {
	c.HTML(200, "index.html", gin.H{})
}

// Run run server
func (s *GinServer) Run(addr string) {
	err := s.Router.Run(addr)
	if err != nil {
		log.Printf("Error: %v", err)
	}
}

// install routes
func (s *GinServer) installRoutes() {
	s.Router.GET("/ping", s.Ping)
	s.Router.Static("/static", "./static")
	s.Router.LoadHTMLGlob("templates/*")
	s.Router.GET("/", s.Home)
	s.Router.POST("/upload", s.Upload)
}

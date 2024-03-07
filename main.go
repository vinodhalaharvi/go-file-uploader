package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
)

func main() {
	// Create a new GinServer
	server := &GinServer{
		Router: gin.Default(),
	}
	// run
	server.installRoutes()
	addr := ":8084"
	fmt.Printf("http://localhost%v/\n", addr)
	server.Run(addr)
}

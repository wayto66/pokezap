package main

import (
	"log"
	"net/http"

	"./src/infra/router"
)

func main() {
        log.Println("hellouu")
    router := router.InitializeRouter()
    log.Println("Servidor iniciado em http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", router))
}

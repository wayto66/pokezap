package modules

import (
    "fmt"
    "net/http"
)

func HandleModuleA(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Executando ação do Módulo A")
}
package modules

import (
    "fmt"
    "net/http"
)

func HandleModuleB(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Executando ação do Módulo B")
}
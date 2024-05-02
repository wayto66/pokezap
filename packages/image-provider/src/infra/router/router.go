package router

import (
    "net/http"
    "../../modules"
)

func InitializeRouter() *http.ServeMux {
    mux := http.NewServeMux()
    mux.HandleFunc("/", modules.HandleHome)
    mux.HandleFunc("/moduleA", modules.HandleModuleA)
    mux.HandleFunc("/moduleB", modules.HandleModuleB)
    return mux
}
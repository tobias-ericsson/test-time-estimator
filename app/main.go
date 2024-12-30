package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
)

// Embed the static directory into the binary

//go:embed web/*
var embeddedFiles embed.FS

func main() {
	http.HandleFunc("/info", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "UP")
	})

	// Create a file system from the embedded files
	staticFiles, err := fs.Sub(embeddedFiles, "web")
	if err != nil {
		panic("Failed to load embedded static files: " + err.Error())
	}

	// Serve the embedded static files
	http.Handle("/", http.FileServer(http.FS(staticFiles)))

	// Start the server
	port := ":8080"
	println("Serving files on http://localhost" + port)
	if err := http.ListenAndServe(port, nil); err != nil {
		println("Error starting server:", err)
	}
}

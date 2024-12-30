#!/bin/bash
NAME="test-time-estimator"
OUTPUT_DIR="bin"
mkdir -p $OUTPUT_DIR

echo "Building for macOS (darwin)..."
CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -ldflags="-s -w" -o $OUTPUT_DIR/${NAME}-mac-amd64 app/main.go
CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w" -o $OUTPUT_DIR/${NAME}-mac-arm64 app/main.go

echo "Building for Windows..."
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o $OUTPUT_DIR/${NAME}-windows.exe app/main.go

echo "Building for Linux..."
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o $OUTPUT_DIR/${NAME}-linux app/main.go

echo "Binaries built and stored in the $OUTPUT_DIR directory."

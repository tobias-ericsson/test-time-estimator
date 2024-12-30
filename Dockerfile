FROM golang:1.20 AS builder

WORKDIR /app
COPY app .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o server main.go

FROM scratch

# Set the working directory
WORKDIR /app

# Copy the compiled binary from the builder
COPY --from=builder /app/server .

# Expose the desired port
EXPOSE 8080

# Command to run the application
CMD ["./server"]

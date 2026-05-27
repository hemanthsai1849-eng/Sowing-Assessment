#!/bin/bash

# Sowing Assessment Frontend - Docker Build & Run Script

set -e

echo "🌾 Sowing Assessment - Docker Setup"
echo "===================================="
echo ""

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t sowing-assessment-frontend:latest .

if [ $? -eq 0 ]; then
    echo "✓ Docker image built successfully"
else
    echo "❌ Docker build failed"
    exit 1
fi

echo ""
echo "🚀 Starting container..."
docker run -d \
    --name sowing-frontend \
    -p 3000:3000 \
    -e VITE_API_URL=http://localhost:8080/api \
    sowing-assessment-frontend:latest

echo "✓ Container started successfully"
echo ""
echo "📍 Application URL: http://localhost:3000"
echo "📊 Check logs: docker logs sowing-frontend"
echo ""
echo "To stop the container:"
echo "  docker stop sowing-frontend"
echo "  docker rm sowing-frontend"
echo ""

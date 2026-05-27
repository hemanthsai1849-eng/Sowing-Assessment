#!/bin/bash

# Sowing Assessment Frontend - Installation Script
# This script sets up the frontend development environment

set -e

echo "🌾 Sowing Assessment & Fallow Land Intelligence"
echo "================================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js version: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✓ npm version: $NPM_VERSION"

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✓ Dependencies installed successfully!"

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo ""
    echo "📝 Creating .env.local configuration file..."
    cp .env.example .env.local
    echo "✓ Configuration file created. Update .env.local with your settings."
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Review and update .env.local with your settings"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""

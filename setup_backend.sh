#!/bin/bash
# Setup script for the backend environment

echo "🚀 Setting up Backend Environment"
echo "================================="

# Check if we're in the right directory
if [ ! -f "backend/main.py" ]; then
    echo "❌ Please run this script from the main project directory"
    echo "   Usage: ./setup_backend.sh"
    exit 1
fi

cd backend

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "📝 Creating .env file from .env.example"
        cp .env.example .env
        echo "✅ .env file created!"
        echo "⚠️  Please edit .env and add your GEMINI_API_KEY"
    else
        echo "❌ .env.example not found"
        exit 1
    fi
else
    echo "✅ .env file already exists"
fi

# Check if virtual environment exists
if [ ! -d "../.venv" ]; then
    echo "🔧 Creating virtual environment..."
    cd ..
    python -m venv .venv
    cd backend
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
echo "📦 Installing dependencies..."
source ../.venv/bin/activate

# Check if requirements.txt exists
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
elif [ -f "pyproject.toml" ]; then
    pip install -e .
else
    echo "📦 Installing core dependencies..."
    pip install fastapi uvicorn[standard] google-generativeai PyPDF2 python-multipart python-dotenv requests
fi

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Edit backend/.env and add your GEMINI_API_KEY"
echo "2. Start the server: cd backend && uvicorn main:app --reload"
echo "3. Test the API at: http://localhost:8000/docs"
echo ""
echo "🔑 Get your Gemini API key at: https://aistudio.google.com/"
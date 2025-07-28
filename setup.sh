#!/bin/bash

# BookSwap Setup Script
echo "🚀 Setting up BookSwap..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Backend Setup
echo "📚 Setting up Django backend..."

cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running database migrations..."
python manage.py migrate

# Create superuser (optional)
echo "Would you like to create a superuser? (y/n)"
read -r create_superuser
if [[ $create_superuser =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

cd ..

# Frontend Setup
echo "⚛️  Setting up React frontend..."

cd frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

cd ..

echo "🎉 Setup complete!"
echo ""
echo "To start the development servers:"
echo ""
echo "Backend (Django):"
echo "  cd backend"
echo "  source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "  python manage.py runserver"
echo ""
echo "Frontend (React):"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Or use Docker:"
echo "  docker-compose up --build"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000"
echo "  Django Admin: http://localhost:8000/admin" 
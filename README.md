# BookSwap 📚

A modern, full-stack web application that revolutionizes book sharing and trading. BookSwap connects book lovers worldwide, allowing them to discover, trade, and donate books while building a community of trusted readers.

## 🌟 What Makes BookSwap Special

BookSwap isn't just another book marketplace - it's a community-driven platform that makes book sharing personal and trustworthy:

### **Smart Trading System**
- **Flexible Trade Options**: Choose between traditional book swaps or generous donations
- **Reliability Scoring**: Built-in reputation system shows user reliability based on successful trades
- **Confirmation Process**: Both parties confirm receipt, ensuring safe and transparent exchanges
- **Real-time Status Tracking**: See exactly where your trade stands at every step

### **Community-First Approach**
- **Trust Building**: Reliability badges help users identify trustworthy trading partners
- **User Profiles**: Detailed profiles with trading history and reliability scores
- **Book Discovery**: Advanced search and filtering to find your next great read
- **Personal Connections**: Direct messaging system for coordinating trades

### **Modern User Experience**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Intuitive Interface**: Clean, modern UI that makes trading effortless
- **Real-time Updates**: Live notifications and status updates
- **Smart Notifications**: Know when trades are accepted, confirmed, or completed

## 🚀 Key Features

### **Authentication & Profiles**
- Secure JWT-based authentication system
- Comprehensive user profiles with bio, location, and trading history
- Reliability scoring system (New User → Reliable → Very Reliable → Highly Reliable)
- Profile editing and customization

### **Book Management**
- Add books to your collection with detailed information
- Upload book cover images
- Set book condition and availability status
- Advanced search and filtering by genre, condition, author, and more
- Book detail pages with owner reliability information

### **Advanced Trade System**
- **Dual Trade Types**:
  - **Book Swaps**: Traditional one-for-one book exchanges
  - **Donations**: Generous one-way book giving
- **Smart Acceptance Flow**: Recipients can choose to swap or accept as donation
- **Confirmation System**: 
  - Swaps: Both parties must confirm receipt
  - Donations: Only recipient confirms (donor doesn't see confirmation button)
- **Status Tracking**: Real-time updates on trade progress
- **Trade History**: Complete record of all trades (sent, received, completed, donations)

### **Reliability & Trust**
- **Automatic Scoring**: Successful trades automatically increase user reliability
- **Visual Badges**: Color-coded reliability indicators throughout the platform
- **Trade Counts**: Display successful trade numbers on profiles and book listings
- **Trust Indicators**: See reliability scores before initiating trades

## 🛠️ Technology Stack

### **Backend (Django REST Framework)**
- **Django 4.2** - Robust web framework with excellent admin interface
- **Django REST Framework** - Powerful API development with automatic documentation
- **JWT Authentication** - Secure, stateless authentication system
- **SQLite** - Lightweight database perfect for development and small deployments
- **Django CORS Headers** - Seamless frontend-backend communication
- **Django Filter** - Advanced filtering and search capabilities

### **Frontend (React)**
- **React 18** - Modern, component-based UI framework
- **React Router** - Client-side routing for smooth navigation
- **React Query** - Intelligent data fetching, caching, and synchronization
- **React Hook Form** - Performant form handling with validation
- **TailwindCSS** - Utility-first CSS for rapid, consistent styling
- **Axios** - Reliable HTTP client for API communication

### **Development & Deployment**
- **GitHub Actions** - Automated testing and deployment pipeline
- **Docker** - Containerized development and deployment
- **ESLint & Prettier** - Code quality and formatting
- **Hot Reload** - Instant development feedback

## 📁 Project Structure

```
BookSwap/
├── backend/                    # Django REST API
│   ├── bookswap/              # Django project settings & configuration
│   ├── users/                 # User authentication & profiles
│   │   ├── models.py         # User model with reliability scoring
│   │   ├── serializers.py    # User data serialization
│   │   ├── views.py          # Authentication endpoints
│   │   └── urls.py           # User-related URL routing
│   ├── books/                # Book management system
│   │   ├── models.py         # Book model with owner relationships
│   │   ├── serializers.py    # Book data serialization
│   │   ├── views.py          # Book CRUD operations & search
│   │   └── urls.py           # Book-related URL routing
│   ├── trades/               # Advanced trade system
│   │   ├── models.py         # Trade & TradeMessage models
│   │   ├── serializers.py    # Trade data serialization
│   │   ├── views.py          # Trade operations & confirmation
│   │   └── urls.py           # Trade-related URL routing
│   └── requirements.txt      # Python dependencies
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── BookCard.js   # Book display component
│   │   │   ├── TradeCard.js  # Trade status component
│   │   │   └── ...           # Other components
│   │   ├── pages/            # Main application pages
│   │   │   ├── Home.js       # Book browsing & search
│   │   │   ├── Profile.js    # User profile management
│   │   │   ├── Trades.js     # Trade management
│   │   │   └── ...           # Other pages
│   │   ├── contexts/         # React context providers
│   │   │   └── AuthContext.js # Authentication state management
│   │   ├── services/         # API communication layer
│   │   │   └── api.js        # Axios configuration & API calls
│   │   └── utils/            # Helper functions & utilities
│   ├── public/               # Static assets
│   └── package.json          # Node.js dependencies
├── .github/
│   └── workflows/            # CI/CD pipeline configuration
├── docker-compose.yml        # Development environment setup
└── setup.sh                  # Quick development setup script
```

## 🔌 API Endpoints

### **Authentication & Users**
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and receive JWT token
- `GET /api/auth/profile` - Retrieve current user profile
- `PUT /api/auth/profile` - Update user profile information

### **Book Management**
- `GET /api/books/` - List all books with advanced filtering
- `POST /api/books/` - Add new book to user's collection
- `GET /api/books/{id}/` - Get detailed book information
- `PUT /api/books/{id}/` - Update book details
- `DELETE /api/books/{id}/` - Remove book from collection
- `GET /api/books/my_books/` - Get current user's books
- `GET /api/books/available/` - Get all available books for trading

### **Advanced Trade System**
- `GET /api/trades/` - List all user's trades
- `POST /api/trades/` - Send trade request (swap or donation)
- `PATCH /api/trades/{id}/` - Update trade status
- `DELETE /api/trades/{id}/` - Cancel trade request
- `POST /api/trades/{id}/accept_trade/` - Accept trade with swap/donation choice
- `POST /api/trades/{id}/confirm_trade/` - Confirm book receipt
- `GET /api/trades/sent/` - Get sent trade requests
- `GET /api/trades/received/` - Get received trade requests
- `GET /api/trades/completed/` - Get completed trades
- `GET /api/trades/donations/` - Get donation history

## 🚀 Quick Start Guide

### **Prerequisites**
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager

### **Backend Setup (Django)**

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create admin user (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Django development server:**
   ```bash
   python manage.py runserver
   ```

The Django API will be available at `http://localhost:8000`

### **Frontend Setup (React)**

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start React development server:**
   ```bash
   npm start
   ```

The React application will be available at `http://localhost:3000`

### **Alternative: Docker Setup**

For a containerized development environment:

```bash
docker-compose up --build
```

This will start both backend and frontend services automatically.

## 🛠️ Development

### **Backend Development**
- **Django Admin**: Access at `http://localhost:8000/admin/` for data management
- **API Documentation**: Available at `/api/docs/` when running
- **Testing**: Run `python manage.py test` for backend tests
- **Migrations**: Use `python manage.py makemigrations` for model changes

### **Frontend Development**
- **Hot Reload**: Automatic page refresh on code changes
- **Code Quality**: ESLint and Prettier configured for consistent code
- **Testing**: Run `npm test` for frontend tests
- **Build**: Use `npm run build` for production build

## ⚙️ Environment Configuration

### **Backend Environment (.env)**
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
DATABASE_URL=sqlite:///db.sqlite3
```

### **Frontend Environment (.env)**
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
```

## 🧪 Testing

### **Backend Testing**
```bash
cd backend
python manage.py test
```

### **Frontend Testing**
```bash
cd frontend
npm test
```

### **End-to-End Testing**
The project includes comprehensive test coverage for both backend API endpoints and frontend components.

## 🚀 Deployment

### **Backend Deployment**
1. Set `DEBUG=False` in production settings
2. Configure production database (PostgreSQL recommended for production)
3. Set up static file serving with a web server
4. Configure CORS settings for your production domain
5. Set up environment variables for production

### **Frontend Deployment**
1. Build production version: `npm run build`
2. Serve static files from the `build` directory
3. Configure API URL for production environment
4. Set up HTTPS for secure communication

### **Production Considerations**
- Use PostgreSQL for production database
- Set up Redis for caching (optional)
- Configure proper CORS settings
- Set up SSL/TLS certificates
- Use environment variables for sensitive data
- Set up monitoring and logging

## 🎯 What Makes This Project Stand Out

### **Innovative Trade System**
Unlike traditional book marketplaces, BookSwap offers a unique dual-trade system that accommodates both traditional swaps and generous donations, making it accessible to users with different preferences and circumstances.

### **Trust & Reliability**
The built-in reliability scoring system creates a trustworthy community where users can make informed decisions about trading partners, reducing the risk of bad experiences.

### **User-Centric Design**
Every feature is designed with the user experience in mind, from the intuitive trade flow to the detailed confirmation process that ensures both parties are satisfied.

### **Modern Technology Stack**
Built with cutting-edge technologies that ensure scalability, maintainability, and excellent performance while providing a smooth development experience.

### **Community Building**
BookSwap isn't just about trading books - it's about building connections between readers, creating a community of book lovers who share their passion for literature.

This project demonstrates modern full-stack development practices, from secure authentication and API design to responsive frontend development and automated testing. It's a complete, production-ready application that showcases best practices in web development. 
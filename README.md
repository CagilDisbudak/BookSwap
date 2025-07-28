# BookSwap 📚

A full-stack web application where users can list their books, browse other users' collections, and send trade requests. Built with Django REST Framework, React, and JWT authentication.

## Features

- **User Authentication**: JWT-based login/register system
- **Book Management**: Add, edit, and manage your book collection
- **Book Discovery**: Browse and search other users' books
- **Trade System**: Send and manage trade requests
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Real-time Updates**: Live notifications for trade requests

## Tech Stack

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - API development
- **Django CORS Headers** - Cross-origin resource sharing
- **PyJWT** - JSON Web Token authentication
- **SQLite** - Database (development)

### Frontend
- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **React Query** - Data fetching and caching

### DevOps
- **GitHub Actions** - CI/CD pipeline
- **Docker** - Containerization

## Project Structure

```
BookSwap/
├── backend/                 # Django REST API
│   ├── bookswap/           # Django project settings
│   ├── api/                # API endpoints
│   ├── books/              # Book management
│   ├── trades/             # Trade system
│   └── users/              # User authentication
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── .github/
│   └── workflows/          # GitHub Actions
└── docker-compose.yml      # Development environment
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile

### Books
- `GET /api/books/` - List all books (with filters)
- `POST /api/books/` - Add a new book
- `GET /api/books/{id}/` - Get book details
- `PUT /api/books/{id}/` - Update book
- `DELETE /api/books/{id}/` - Delete book

### Trades
- `GET /api/trades/` - List user's trades
- `POST /api/trades/` - Send a trade request
- `PATCH /api/trades/{id}/` - Accept/reject trade
- `DELETE /api/trades/{id}/` - Cancel trade

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

The React app will be available at `http://localhost:3000`

### Using Docker (Alternative)

1. **Build and start services:**
   ```bash
   docker-compose up --build
   ```

## Development

### Backend Development
- API documentation available at `/api/docs/` (when running)
- Use Django admin at `/admin/` for data management
- Run tests: `python manage.py test`

### Frontend Development
- Hot reload enabled for development
- ESLint and Prettier configured
- Run tests: `npm test`

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
1. Set `DEBUG=False` in production
2. Configure production database (PostgreSQL recommended)
3. Set up static file serving
4. Configure CORS for production domain

### Frontend Deployment
1. Build production version: `npm run build`
2. Serve static files from build directory
3. Configure API URL for production

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team. 
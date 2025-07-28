import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookDetail from './pages/BookDetail';
import Profile from './pages/Profile';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import Trades from './pages/Trades';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : children;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/books/add" element={
            <PrivateRoute>
              <AddBook />
            </PrivateRoute>
          } />
          <Route path="/books/:id/edit" element={
            <PrivateRoute>
              <EditBook />
            </PrivateRoute>
          } />
          <Route path="/trades" element={
            <PrivateRoute>
              <Trades />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 
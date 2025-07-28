import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">BookSwap</h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Books
                </Link>
                <Link
                  to="/trades"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Trades
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 text-sm">
                    Welcome, {user.first_name || user.username}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Books
                </Link>
                <Link
                  to="/trades"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trades
                </Link>
                <div className="border-t border-gray-200 pt-4">
                  <span className="text-gray-700 block px-3 py-2 text-sm">
                    Welcome, {user.first_name || user.username}!
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="btn btn-secondary w-full mt-2"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
            {!user && (
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 
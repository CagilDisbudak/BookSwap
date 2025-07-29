import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { booksAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import TradeRequestModal from '../components/TradeRequestModal';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showTradeModal, setShowTradeModal] = useState(false);

  const { data: book, isLoading, error } = useQuery(
    ['book', id],
    () => booksAPI.getById(id)
  );

  const handleTradeSuccess = () => {
    // Optionally show a success message or redirect
    console.log('Trade request sent successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading book details. Please try again.</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Book not found.</p>
      </div>
    );
  }

  const isOwner = user && book.owner.id === user.id;
  const canTrade = user && !isOwner && book.is_available;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600">by {book.author}</p>
          </div>
          <div className="flex space-x-3">
            {isOwner ? (
              <>
                <button
                  onClick={() => navigate(`/books/${book.id}/edit`)}
                  className="btn btn-secondary"
                >
                  Edit Book
                </button>
              </>
            ) : canTrade ? (
              <button
                onClick={() => setShowTradeModal(true)}
                className="btn btn-primary"
              >
                Request Trade
              </button>
            ) : !user ? (
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Login to Trade
              </button>
            ) : null}
          </div>
        </div>

        {/* Book Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cover Image */}
          <div className="lg:col-span-1">
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={book.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
          </div>

          {/* Book Information */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Genre</label>
                  <p className="text-gray-900">{book.genre}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Condition</label>
                  <p className="text-gray-900">{book.condition}</p>
                </div>
                {book.isbn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ISBN</label>
                    <p className="text-gray-900">{book.isbn}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Availability</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.is_available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.is_available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>

              {/* Owner Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Owner</label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900">{book.owner_name}</span>
                  {book.owner && book.owner.reliability_score && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      book.owner.reliability_score === 'New User' ? 'bg-gray-100 text-gray-600' :
                      book.owner.reliability_score === 'Reliable' ? 'bg-blue-100 text-blue-600' :
                      book.owner.reliability_score === 'Very Reliable' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {book.owner.reliability_score}
                    </span>
                  )}
                </div>
                {book.owner && (
                  <p className="text-sm text-gray-600 mt-1">
                    {book.owner.successful_trades_count || 0} successful trades
                  </p>
                )}
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-gray-900">{book.description}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Added</label>
                  <p>{new Date(book.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p>{new Date(book.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Request Modal */}
      <TradeRequestModal
        isOpen={showTradeModal}
        onClose={() => setShowTradeModal(false)}
        book={book}
        onSuccess={handleTradeSuccess}
      />
    </div>
  );
};

export default BookDetail; 
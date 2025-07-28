import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { booksAPI, tradesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import TradeRequestModal from '../components/TradeRequestModal';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showTradeModal, setShowTradeModal] = useState(false);

  const { data: book, isLoading, error } = useQuery(
    ['book', id],
    () => booksAPI.getById(id)
  );

  const createTradeMutation = useMutation(
    (tradeData) => tradesAPI.create(tradeData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['trades']);
        setShowTradeModal(false);
        // Show success message
      },
    }
  );

  const handleTradeRequest = (tradeData) => {
    createTradeMutation.mutate({
      ...tradeData,
      requested_book: book.id,
      recipient: book.owner.id,
    });
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
        <p className="text-red-600">Error loading book. Please try again.</p>
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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Book Cover */}
          <div className="md:w-1/3 p-6">
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={`Cover of ${book.title}`}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="md:w-2/3 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {book.genre.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                  {book.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                {book.is_available ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Available
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    Not Available
                  </span>
                )}
              </div>

              {book.isbn && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">ISBN:</span> {book.isbn}
                </p>
              )}

              {book.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{book.description}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Owner</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {book.owner_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{book.owner_name}</p>
                    <p className="text-sm text-gray-600">Member since {new Date(book.owner.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>Added on {new Date(book.created_at).toLocaleDateString()}</p>
                {book.updated_at !== book.created_at && (
                  <p>Last updated on {new Date(book.updated_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isOwner ? (
                <>
                  <button
                    onClick={() => navigate(`/books/${book.id}/edit`)}
                    className="btn btn-primary"
                  >
                    Edit Book
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="btn btn-secondary"
                  >
                    Back to My Books
                  </button>
                </>
              ) : canTrade ? (
                <button
                  onClick={() => setShowTradeModal(true)}
                  className="btn btn-primary"
                  disabled={createTradeMutation.isLoading}
                >
                  {createTradeMutation.isLoading ? 'Sending Request...' : 'Request Trade'}
                </button>
              ) : !user ? (
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary"
                >
                  Login to Trade
                </button>
              ) : (
                <p className="text-gray-600">This book is not available for trade.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trade Request Modal */}
      {showTradeModal && (
        <TradeRequestModal
          book={book}
          onSubmit={handleTradeRequest}
          onClose={() => setShowTradeModal(false)}
          isLoading={createTradeMutation.isLoading}
        />
      )}
    </div>
  );
};

export default BookDetail; 
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { booksAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const TradeRequestModal = ({ book, onSubmit, onClose, isLoading }) => {
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState(null);

  const { data: myBooks, isLoading: loadingBooks } = useQuery(
    ['my-books'],
    () => booksAPI.getMyBooks(),
    {
      enabled: !!user,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      offered_book: selectedBook,
    });
  };

  const availableBooks = myBooks?.filter(book => book.is_available) || [];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Request Trade for "{book.title}"
          </h3>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Book Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a book to offer (optional)
              </label>
              {loadingBooks ? (
                <div className="text-sm text-gray-500">Loading your books...</div>
              ) : availableBooks.length > 0 ? (
                <select
                  onChange={(e) => {
                    const bookId = e.target.value;
                    setSelectedBook(bookId ? parseInt(bookId) : null);
                  }}
                  className="input"
                >
                  <option value="">No book offered</option>
                  {availableBooks.map((myBook) => (
                    <option key={myBook.id} value={myBook.id}>
                      {myBook.title} by {myBook.author}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-500">
                  You don't have any available books to offer.
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to {book.owner_name}
              </label>
              <textarea
                {...register('message', {
                  maxLength: {
                    value: 500,
                    message: 'Message must be less than 500 characters'
                  }
                })}
                rows={4}
                className="input"
                placeholder="Introduce yourself and explain why you'd like to trade for this book..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TradeRequestModal; 
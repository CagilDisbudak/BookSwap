import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { booksAPI, tradesAPI } from '../services/api';

const TradeRequestModal = ({ isOpen, onClose, book, onSuccess }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [tradeType, setTradeType] = useState('swap');
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const { data: myBooks, isLoading } = useQuery(
    ['my-available-books'],
    () => booksAPI.getMyBooks().then(books => books.filter(book => book.is_available))
  );

  const createTradeMutation = useMutation(
    (tradeData) => tradesAPI.create(tradeData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['trades']);
        onSuccess();
        onClose();
        reset();
      },
      onError: (error) => {
        console.error('Trade creation failed:', error);
        console.error('Error response:', error.response?.data);
        alert(`Failed to create trade request: ${error.response?.data?.message || error.message}`);
      },
    }
  );

  const onSubmit = (data) => {
    const tradeData = {
      recipient: book.owner.id,
      requested_book: book.id,
      message: data.message,
    };

    if (tradeType === 'swap' && selectedBook) {
      tradeData.offered_book = selectedBook;
    }

    console.log('Book object:', book);
    console.log('Sending trade data:', tradeData);
    createTradeMutation.mutate(tradeData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Request Trade</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Requesting: {book.title}</h4>
          <p className="text-sm text-gray-600">Owner: {book.owner_name}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Trade Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trade Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="swap"
                  checked={tradeType === 'swap'}
                  onChange={(e) => setTradeType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Book Swap</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="donation"
                  checked={tradeType === 'donation'}
                  onChange={(e) => setTradeType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Request Donation</span>
              </label>
            </div>
          </div>

          {/* Book Selection for Swap */}
          {tradeType === 'swap' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a book to offer *
              </label>
              {isLoading ? (
                <div className="text-sm text-gray-500">Loading your books...</div>
              ) : myBooks?.length > 0 ? (
                <select
                  value={selectedBook || ''}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Choose a book to offer</option>
                  {myBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-red-600">
                  You need to have available books to make a swap request.
                </div>
              )}
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (optional)
            </label>
            <textarea
              {...register('message')}
              rows={3}
              className="input"
              placeholder={tradeType === 'swap' 
                ? "Tell them about your book or arrange details..." 
                : "Explain why you'd like this book..."
              }
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={createTradeMutation.isLoading || (tradeType === 'swap' && !selectedBook)}
              className="btn btn-primary flex-1"
            >
              {createTradeMutation.isLoading ? 'Sending...' : 
               tradeType === 'swap' ? 'Send Swap Request' : 'Request Donation'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeRequestModal; 
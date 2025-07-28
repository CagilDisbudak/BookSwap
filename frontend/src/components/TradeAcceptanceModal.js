import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { booksAPI, tradesAPI } from '../services/api';

const TradeAcceptanceModal = ({ isOpen, onClose, trade, onSuccess }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [tradeType, setTradeType] = useState('swap');
  const queryClient = useQueryClient();

  const { data: myBooks, isLoading } = useQuery(
    ['my-available-books'],
    () => booksAPI.getMyBooks().then(books => books.filter(book => book.is_available)),
    {
      enabled: isOpen,
    }
  );

  const acceptTradeMutation = useMutation(
    (acceptanceData) => tradesAPI.acceptTrade(trade.id, acceptanceData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['trades']);
        onSuccess();
        onClose();
      },
      onError: (error) => {
        console.error('Trade acceptance failed:', error);
        console.error('Error response:', error.response?.data);
        alert(`Failed to accept trade: ${JSON.stringify(error.response?.data)}`);
      },
    }
  );

  const handleAccept = () => {
    const acceptanceData = {
      trade_type: tradeType,
      recipient_offered_book: tradeType === 'swap' ? parseInt(selectedBook) : null,
    };

    console.log('Sending acceptance data:', acceptanceData);
    console.log('Trade object:', trade);
    acceptTradeMutation.mutate(acceptanceData);
  };

  if (!isOpen || !trade) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Accept Trade Request</h3>
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
          <h4 className="font-medium text-gray-900 mb-2">Trade Request Details</h4>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{trade.requester.username}</span> wants your book:
            </p>
            <p className="font-medium text-gray-900 mt-1">{trade.requested_book.title}</p>
            {trade.offered_book && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">They're offering:</p>
                <p className="font-medium text-gray-900">{trade.offered_book.title}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Trade Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you like to respond?
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
                <span className="text-sm">Accept as Book Swap</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="donation"
                  checked={tradeType === 'donation'}
                  onChange={(e) => setTradeType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Accept as Donation</span>
              </label>
            </div>
          </div>

          {/* Book Selection for Swap */}
          {tradeType === 'swap' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a book to offer back *
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
                  You need to have available books to make a swap.
                </div>
              )}
            </div>
          )}

          {/* Donation Info */}
          {tradeType === 'donation' && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                💝 You're choosing to donate your book without receiving one in return.
                This is a generous act that helps build the BookSwap community!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleAccept}
              disabled={acceptTradeMutation.isLoading || (tradeType === 'swap' && !selectedBook)}
              className="btn btn-primary flex-1"
            >
              {acceptTradeMutation.isLoading ? 'Accepting...' : 
               tradeType === 'swap' ? 'Accept Swap' : 'Accept Donation'}
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeAcceptanceModal; 
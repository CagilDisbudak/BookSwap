import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TradeCard = ({ trade, onAccept, onReject, onConfirm, onCancel }) => {
  const { user } = useAuth();
  const isRequester = trade.requester.id === user.id;
  const isRecipient = trade.recipient.id === user.id;

  const getStatusBadge = () => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[trade.status]}`}>
        {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
      </span>
    );
  };

  const getTradeTypeBadge = () => {
    if (trade.trade_type === 'donation') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          🎁 Donation
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        📚 Swap
      </span>
    );
  };

  const getConfirmationStatus = () => {
    if (trade.status !== 'accepted') return null;

    const requesterConfirmed = trade.requester_confirmed;
    const recipientConfirmed = trade.recipient_confirmed;

    if (trade.trade_type === 'donation') {
      // For donations, only recipient needs to confirm
      if (recipientConfirmed) {
        return (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Donation confirmed</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center space-x-2 text-sm text-yellow-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Waiting for recipient to confirm</span>
          </div>
        );
      }
    } else {
      // For swaps, both parties need to confirm
      if (requesterConfirmed && recipientConfirmed) {
        return (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Both parties confirmed</span>
          </div>
        );
      } else {
        // Show detailed status for swaps
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-yellow-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Waiting for confirmation</span>
            </div>
            <div className="ml-6 space-y-1 text-xs text-gray-600">
              <div className={`flex items-center space-x-1 ${requesterConfirmed ? 'text-green-600' : 'text-gray-500'}`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  {requesterConfirmed ? (
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  )}
                </svg>
                <span>{trade.requester.username} {requesterConfirmed ? 'confirmed' : 'has not confirmed'}</span>
              </div>
              <div className={`flex items-center space-x-1 ${recipientConfirmed ? 'text-green-600' : 'text-gray-500'}`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  {recipientConfirmed ? (
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  )}
                </svg>
                <span>{trade.recipient.username} {recipientConfirmed ? 'confirmed' : 'has not confirmed'}</span>
              </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">
              {isRequester ? `To: ${trade.recipient.username}` : `From: ${trade.requester.username}`}
            </h3>
            {isRequester && trade.recipient.reliability_score && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                trade.recipient.reliability_score === 'New User' ? 'bg-gray-100 text-gray-600' :
                trade.recipient.reliability_score === 'Reliable' ? 'bg-blue-100 text-blue-600' :
                trade.recipient.reliability_score === 'Very Reliable' ? 'bg-green-100 text-green-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {trade.recipient.reliability_score}
              </span>
            )}
            {!isRequester && trade.requester.reliability_score && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                trade.requester.reliability_score === 'New User' ? 'bg-gray-100 text-gray-600' :
                trade.requester.reliability_score === 'Reliable' ? 'bg-blue-100 text-blue-600' :
                trade.requester.reliability_score === 'Very Reliable' ? 'bg-green-100 text-green-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {trade.requester.reliability_score}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {new Date(trade.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          {getStatusBadge()}
          {getTradeTypeBadge()}
        </div>
      </div>

      {/* Trade Details */}
      <div className="space-y-3 mb-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            {isRequester ? 'You requested:' : 'You\'re offering:'}
          </p>
          <p className="font-medium text-gray-900">
            {trade.requested_book.title} by {trade.requested_book.author}
          </p>
        </div>

        {trade.offered_book && (
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              {isRequester ? 'You offered:' : 'They offered:'}
            </p>
            <p className="font-medium text-gray-900">
              {trade.offered_book.title} by {trade.offered_book.author}
            </p>
          </div>
        )}

        {trade.recipient_offered_book && (
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              {isRecipient ? 'You offered back:' : 'They offered back:'}
            </p>
            <p className="font-medium text-gray-900">
              {trade.recipient_offered_book.title} by {trade.recipient_offered_book.author}
            </p>
          </div>
        )}

        {trade.message && (
          <div className="bg-yellow-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Message:</p>
            <p className="text-gray-900">{trade.message}</p>
          </div>
        )}
      </div>

      {/* Confirmation Status */}
      {getConfirmationStatus()}

      {/* Action Buttons */}
      {trade.status === 'pending' && isRecipient && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => onAccept(trade)}
            className="btn btn-primary"
          >
            Accept
          </button>
          <button
            onClick={() => onReject(trade.id)}
            className="btn btn-danger"
          >
            Reject
          </button>
        </div>
      )}

      {trade.status === 'pending' && isRequester && (
        <div className="mt-4">
          <button
            onClick={() => onCancel(trade.id)}
            className="btn btn-secondary"
          >
            Cancel Request
          </button>
        </div>
      )}

      {trade.status === 'accepted' && !trade.is_completed && (
        <div className="mt-4">
          {trade.trade_type === 'donation' ? (
            // For donations, only recipient can confirm
            isRecipient && (
              <button
                onClick={() => onConfirm(trade.id)}
                className="btn btn-primary"
              >
                Donate Book
              </button>
            )
          ) : (
            // For swaps, both parties can confirm
            <button
              onClick={() => onConfirm(trade.id)}
              className="btn btn-primary"
            >
              I Received the Book
            </button>
          )}
        </div>
      )}

      {trade.status === 'completed' && (
        <div className="mt-4">
          <div className="flex items-center space-x-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Trade Completed</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeCard; 
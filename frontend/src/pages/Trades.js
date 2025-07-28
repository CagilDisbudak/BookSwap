import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { tradesAPI } from '../services/api';

const Trades = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('received');

  const { data: receivedTrades, isLoading: loadingReceived } = useQuery(
    ['received-trades'],
    () => tradesAPI.getReceivedTrades()
  );

  const { data: sentTrades, isLoading: loadingSent } = useQuery(
    ['sent-trades'],
    () => tradesAPI.getSentTrades()
  );

  const updateTradeMutation = useMutation(
    ({ tradeId, status }) => tradesAPI.update(tradeId, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['received-trades']);
        queryClient.invalidateQueries(['sent-trades']);
      },
    }
  );

  const handleTradeAction = (tradeId, status) => {
    updateTradeMutation.mutate({ tradeId, status });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const isLoading = loadingReceived || loadingSent;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Trade Requests</h1>
        <p className="text-gray-600">
          Manage your incoming and outgoing trade requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Received ({receivedTrades?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent ({sentTrades?.length || 0})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'received' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Trade Requests Received</h3>
          {receivedTrades?.length > 0 ? (
            <div className="space-y-4">
              {receivedTrades.map((trade) => (
                <TradeCard
                  key={trade.id}
                  trade={trade}
                  type="received"
                  onAction={handleTradeAction}
                  isLoading={updateTradeMutation.isLoading}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trade requests</h3>
              <p className="text-gray-600">
                You haven't received any trade requests yet.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sent' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Trade Requests Sent</h3>
          {sentTrades?.length > 0 ? (
            <div className="space-y-4">
              {sentTrades.map((trade) => (
                <TradeCard
                  key={trade.id}
                  trade={trade}
                  type="sent"
                  onAction={handleTradeAction}
                  isLoading={updateTradeMutation.isLoading}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trade requests sent</h3>
              <p className="text-gray-600">
                You haven't sent any trade requests yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TradeCard = ({ trade, type, onAction, isLoading }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canCancel = type === 'sent' && trade.status === 'pending';
  const canRespond = type === 'received' && trade.status === 'pending';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            {type === 'received' ? 'Request for your book' : 'Your request'}
          </h4>
          <p className="text-sm text-gray-600">
            {new Date(trade.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(trade.status)}`}>
          {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h5 className="font-medium text-gray-900 mb-2">Requested Book</h5>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-medium">{trade.requested_book.title}</p>
            <p className="text-sm text-gray-600">by {trade.requested_book.author}</p>
          </div>
        </div>

        {trade.offered_book && (
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Offered Book</h5>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium">{trade.offered_book.title}</p>
              <p className="text-sm text-gray-600">by {trade.offered_book.author}</p>
            </div>
          </div>
        )}
      </div>

      {trade.message && (
        <div className="mb-4">
          <h5 className="font-medium text-gray-900 mb-2">Message</h5>
          <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{trade.message}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <p>
            {type === 'received' ? 'From' : 'To'}: {type === 'received' ? trade.requester.first_name : trade.recipient.first_name} {type === 'received' ? trade.requester.last_name : trade.recipient.last_name}
          </p>
        </div>

        {canRespond && (
          <div className="flex space-x-2">
            <button
              onClick={() => onAction(trade.id, 'accepted')}
              disabled={isLoading}
              className="btn btn-primary text-sm"
            >
              Accept
            </button>
            <button
              onClick={() => onAction(trade.id, 'rejected')}
              disabled={isLoading}
              className="btn btn-danger text-sm"
            >
              Reject
            </button>
          </div>
        )}

        {canCancel && (
          <button
            onClick={() => onAction(trade.id, 'cancelled')}
            disabled={isLoading}
            className="btn btn-secondary text-sm"
          >
            Cancel Request
          </button>
        )}
      </div>
    </div>
  );
};

export default Trades; 
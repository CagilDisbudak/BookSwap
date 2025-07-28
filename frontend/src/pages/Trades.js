import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { tradesAPI } from '../services/api';
import TradeCard from '../components/TradeCard';
import TradeAcceptanceModal from '../components/TradeAcceptanceModal';

const Trades = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: receivedTrades, isLoading: loadingReceived } = useQuery(
    ['received-trades'],
    () => tradesAPI.getReceivedTrades()
  );

  const { data: sentTrades, isLoading: loadingSent } = useQuery(
    ['sent-trades'],
    () => tradesAPI.getSentTrades()
  );

  const { data: completedTrades, isLoading: loadingCompleted } = useQuery(
    ['completed-trades'],
    () => tradesAPI.getCompletedTrades()
  );

  const { data: donations, isLoading: loadingDonations } = useQuery(
    ['donations'],
    () => tradesAPI.getDonations()
  );

  const rejectTradeMutation = useMutation(
    (tradeId) => tradesAPI.update(tradeId, { status: 'rejected' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['received-trades']);
      },
    }
  );

  const cancelTradeMutation = useMutation(
    (tradeId) => tradesAPI.update(tradeId, { status: 'cancelled' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['sent-trades']);
      },
    }
  );

  const confirmTradeMutation = useMutation(
    (tradeId) => tradesAPI.confirmTrade(tradeId, { confirm_received: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['received-trades']);
        queryClient.invalidateQueries(['sent-trades']);
        queryClient.invalidateQueries(['completed-trades']);
      },
    }
  );

  const handleAccept = (trade) => {
    setSelectedTrade(trade);
    setShowAcceptanceModal(true);
  };

  const handleReject = (tradeId) => {
    if (window.confirm('Are you sure you want to reject this trade?')) {
      rejectTradeMutation.mutate(tradeId);
    }
  };

  const handleCancel = (tradeId) => {
    if (window.confirm('Are you sure you want to cancel this trade?')) {
      cancelTradeMutation.mutate(tradeId);
    }
  };

  const handleConfirm = (tradeId) => {
    if (window.confirm('Confirm that you have received the book?')) {
      confirmTradeMutation.mutate(tradeId);
    }
  };

  const handleAcceptanceSuccess = () => {
    setShowAcceptanceModal(false);
    setSelectedTrade(null);
  };

  const getTradesForTab = () => {
    switch (activeTab) {
      case 'received':
        return receivedTrades || [];
      case 'sent':
        return sentTrades || [];
      case 'completed':
        return completedTrades || [];
      case 'donations':
        return donations || [];
      default:
        return [];
    }
  };

  const isLoading = loadingReceived || loadingSent || loadingCompleted || loadingDonations;

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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Trade Management</h1>
        <p className="text-gray-600">
          Manage your book trades, donations, and track their progress.
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
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed ({completedTrades?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'donations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Donations ({donations?.length || 0})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'received' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Trade Requests</h2>
            {receivedTrades?.length > 0 ? (
              <div className="space-y-4">
                {receivedTrades.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sent Requests</h2>
            {sentTrades?.length > 0 ? (
              <div className="space-y-4">
                {sentTrades.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sent requests</h3>
                <p className="text-gray-600">
                  You haven't sent any trade requests yet.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Completed Trades</h2>
            {completedTrades?.length > 0 ? (
              <div className="space-y-4">
                {completedTrades.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed trades</h3>
                <p className="text-gray-600">
                  You haven't completed any trades yet.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'donations' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Donations</h2>
            {donations?.length > 0 ? (
              <div className="space-y-4">
                {donations.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No donations</h3>
                <p className="text-gray-600">
                  You haven't been involved in any donations yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Acceptance Modal */}
      <TradeAcceptanceModal
        isOpen={showAcceptanceModal}
        onClose={() => setShowAcceptanceModal(false)}
        trade={selectedTrade}
        onSuccess={handleAcceptanceSuccess}
      />
    </div>
  );
};

export default Trades; 
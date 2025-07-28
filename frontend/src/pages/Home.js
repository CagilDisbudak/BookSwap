import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { booksAPI } from '../services/api';
import BookCard from '../components/BookCard';
import SearchFilters from '../components/SearchFilters';

const Home = () => {
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    condition: '',
    available: 'true',
    exclude_own: 'true',
  });

  const { data: books, isLoading, error } = useQuery(
    ['books', filters],
    () => booksAPI.getAll(filters),
    {
      keepPreviousData: true,
    }
  );

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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
        <p className="text-red-600">Error loading books. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Discover Books to Trade
        </h1>
        <p className="text-gray-600">
          Browse through books available for trade from other readers in the community.
        </p>
      </div>

      <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="mt-8">
        {books?.results?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.results.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later for new books.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {books?.count > 20 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            {books.previous && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: books.previous.split('page=')[1] }))}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {Math.floor(books.count / 20) + 1} of {Math.ceil(books.count / 20)}
            </span>
            {books.next && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: books.next.split('page=')[1] }))}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next
              </button>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Home; 
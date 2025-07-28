import React, { useState } from 'react';

const SearchFilters = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const genres = [
    { value: '', label: 'All Genres' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non_fiction', label: 'Non-Fiction' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci_fi', label: 'Science Fiction' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'biography', label: 'Biography' },
    { value: 'history', label: 'History' },
    { value: 'science', label: 'Science' },
    { value: 'technology', label: 'Technology' },
    { value: 'self_help', label: 'Self-Help' },
    { value: 'cookbook', label: 'Cookbook' },
    { value: 'travel', label: 'Travel' },
    { value: 'poetry', label: 'Poetry' },
    { value: 'drama', label: 'Drama' },
    { value: 'other', label: 'Other' },
  ];

  const conditions = [
    { value: '', label: 'All Conditions' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'very_good', label: 'Very Good' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleGenreChange = (e) => {
    onFilterChange({ genre: e.target.value });
  };

  const handleConditionChange = (e) => {
    onFilterChange({ condition: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      genre: '',
      condition: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Search & Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search books by title, author, or description..."
            value={filters.search}
            onChange={handleSearchChange}
            className="input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters */}
      {isExpanded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                value={filters.genre}
                onChange={handleGenreChange}
                className="input"
              >
                {genres.map((genre) => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={filters.condition}
                onChange={handleConditionChange}
                className="input"
              >
                {conditions.map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters; 
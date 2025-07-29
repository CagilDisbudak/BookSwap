import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const getConditionColor = (condition) => {
    const colors = {
      excellent: 'text-green-600',
      very_good: 'text-blue-600',
      good: 'text-yellow-600',
      fair: 'text-orange-600',
      poor: 'text-red-600',
    };
    return colors[condition] || 'text-gray-600';
  };

  const getGenreColor = (genre) => {
    const colors = {
      fiction: 'bg-purple-100 text-purple-800',
      non_fiction: 'bg-blue-100 text-blue-800',
      mystery: 'bg-gray-100 text-gray-800',
      romance: 'bg-pink-100 text-pink-800',
      sci_fi: 'bg-indigo-100 text-indigo-800',
      fantasy: 'bg-yellow-100 text-yellow-800',
      biography: 'bg-green-100 text-green-800',
      history: 'bg-red-100 text-red-800',
      science: 'bg-teal-100 text-teal-800',
      technology: 'bg-cyan-100 text-cyan-800',
      self_help: 'bg-emerald-100 text-emerald-800',
      cookbook: 'bg-orange-100 text-orange-800',
      travel: 'bg-lime-100 text-lime-800',
      poetry: 'bg-violet-100 text-violet-800',
      drama: 'bg-slate-100 text-slate-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[genre] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col h-full">
        {/* Book Cover */}
        <div className="aspect-w-3 aspect-h-4 mb-4">
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={`Cover of ${book.title}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 mb-2">by {book.author}</p>
          
          {/* Genre and Condition */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGenreColor(book.genre)}`}>
              {book.genre.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(book.condition)} bg-gray-100`}>
              {book.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>

          {/* Owner */}
          <div className="text-sm text-gray-500 mb-3">
            <div className="flex items-center justify-between">
              <span>Owner: {book.owner_name}</span>
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
          </div>

          {/* Availability Status */}
          <div className="mt-auto">
            {book.is_available ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Available
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Not Available
              </span>
            )}
          </div>

          {/* Action Button */}
          <Link
            to={`/books/${book.id}`}
            className="btn btn-primary w-full mt-3"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard; 
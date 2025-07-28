import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { booksAPI } from '../services/api';

const AddBook = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const createBookMutation = useMutation(
    (bookData) => booksAPI.create(bookData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['my-books']);
        navigate('/profile');
      },
    }
  );

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      await createBookMutation.mutateAsync(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add book');
    } finally {
      setIsLoading(false);
    }
  };

  const genres = [
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
    { value: 'excellent', label: 'Excellent' },
    { value: 'very_good', label: 'Very Good' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Add New Book</h1>
        <p className="text-gray-600">
          Share your book with the community and start trading!
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Book Title *
              </label>
              <input
                id="title"
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="input"
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                id="author"
                type="text"
                {...register('author', { required: 'Author is required' })}
                className="input"
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                Genre *
              </label>
              <select
                id="genre"
                {...register('genre', { required: 'Genre is required' })}
                className="input"
              >
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
              {errors.genre && (
                <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                id="condition"
                {...register('condition', { required: 'Condition is required' })}
                className="input"
              >
                <option value="">Select condition</option>
                {conditions.map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
              {errors.condition && (
                <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
              ISBN (optional)
            </label>
            <input
              id="isbn"
              type="text"
              {...register('isbn')}
              className="input"
              placeholder="Enter ISBN if available"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="input"
              placeholder="Tell others about this book..."
            />
          </div>

          <div className="flex items-center">
            <input
              id="is_available"
              type="checkbox"
              {...register('is_available')}
              defaultChecked
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
              Make this book available for trade
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => navigate('/profile')}
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
              {isLoading ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook; 
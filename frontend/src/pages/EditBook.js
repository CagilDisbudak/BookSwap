import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { booksAPI } from '../services/api';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { data: book, isLoading: loadingBook } = useQuery(
    ['book', id],
    () => booksAPI.getById(id)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Reset form when book data is loaded
  React.useEffect(() => {
    if (book) {
      reset(book);
    }
  }, [book, reset]);

  const updateBookMutation = useMutation(
    (bookData) => booksAPI.update(id, bookData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['my-books']);
        queryClient.invalidateQueries(['book', id]);
        navigate('/profile');
      },
    }
  );

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });
      
      // Add image file if selected
      if (selectedFile) {
        formData.append('cover_image', selectedFile);
      }

      await updateBookMutation.mutateAsync(formData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update book');
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

  if (loadingBook) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Book not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit Book</h1>
        <p className="text-gray-600">
          Update your book information and availability.
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
            <label htmlFor="publication" className="block text-sm font-medium text-gray-700 mb-2">
              Publication (optional)
            </label>
            <input
              id="publication"
              type="text"
              {...register('publication')}
              className="input"
              placeholder="Enter publisher name (e.g., Penguin Books, HarperCollins)"
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

          <div>
            <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-2">
              Book Cover Image (optional)
            </label>
            <div className="space-y-4">
              {/* Current Image Display */}
              {book.cover_image && !imagePreview && (
                <div className="relative">
                  <img
                    src={book.cover_image}
                    alt="Current book cover"
                    className="w-48 h-64 object-cover rounded-lg border border-gray-300"
                  />
                  <p className="text-sm text-gray-500 mt-2">Current cover image</p>
                </div>
              )}
              
              {/* Image Upload Input */}
              <div className="flex items-center space-x-4">
                <input
                  id="cover_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              
              {/* New Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="New book cover preview"
                    className="w-48 h-64 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                  <p className="text-sm text-gray-500 mt-2">New cover image (will replace current)</p>
                </div>
              )}
              
              {/* Help Text */}
              <p className="text-sm text-gray-500">
                Upload a clear image of your book cover. Supported formats: JPG, PNG, GIF. Max size: 5MB.
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="is_available"
              type="checkbox"
              {...register('is_available')}
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
              {isLoading ? 'Updating Book...' : 'Update Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook; 
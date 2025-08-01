import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { booksAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import BookCard from '../components/BookCard';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('books');
  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
    }
  });

  const { data: myBooks, isLoading, error } = useQuery(
    ['my-books'],
    () => booksAPI.getMyBooks()
  );

  const deleteBookMutation = useMutation(
    (bookId) => booksAPI.delete(bookId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['my-books']);
      },
    }
  );

  const updateProfileMutation = useMutation(
    (profileData) => updateProfile(profileData),
    {
      onSuccess: (result) => {
        if (result.success) {
          setIsEditing(false);
          setUpdateError('');
          reset({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            bio: user?.bio || '',
            location: user?.location || '',
          });
        } else {
          setUpdateError(result.error);
        }
      },
      onError: (error) => {
        setUpdateError(error.message || 'Failed to update profile');
      }
    }
  );

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBookMutation.mutate(bookId);
    }
  };

  const handleProfileSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateError('');
    reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateError('');
    reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
    });
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
        <p className="text-red-600">Error loading your books. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 text-2xl font-bold">
                {user.first_name?.charAt(0) || user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600">@{user.username}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('books')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'books'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Books ({myBooks?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Settings
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'books' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">My Book Collection</h3>
            <Link
              to="/books/add"
              className="btn btn-primary"
            >
              Add New Book
            </Link>
          </div>

          {myBooks?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myBooks.map((book) => (
                <div key={book.id} className="relative">
                  <BookCard book={book} />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Link
                      to={`/books/${book.id}/edit`}
                      className="bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="bg-white rounded-full p-1 shadow-md hover:bg-red-50"
                      disabled={deleteBookMutation.isLoading}
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books yet</h3>
              <p className="text-gray-600 mb-4">
                Start building your collection by adding your first book.
              </p>
              <Link
                to="/books/add"
                className="btn btn-primary"
              >
                Add Your First Book
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="btn btn-secondary"
              >
                Edit Profile
              </button>
            )}
          </div>

          {updateError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{updateError}</p>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    {...register('first_name', { required: 'First name is required' })}
                    className="input"
                  />
                  {errors.first_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    {...register('last_name', { required: 'Last name is required' })}
                    className="input"
                  />
                  {errors.last_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  rows={3}
                  className="input"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="input"
                  placeholder="City, Country"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  className="btn btn-primary"
                >
                  {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{user.first_name} {user.last_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <p className="text-gray-900">@{user.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              {user.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <p className="text-gray-900">{user.bio}</p>
                </div>
              )}
              {user.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900">{user.location}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Successful Trades</label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900">{user.successful_trades_count || 0}</span>
                  {user.reliability_score && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.reliability_score === 'New User' ? 'bg-gray-100 text-gray-600' :
                      user.reliability_score === 'Reliable' ? 'bg-blue-100 text-blue-600' :
                      user.reliability_score === 'Very Reliable' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {user.reliability_score}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile; 
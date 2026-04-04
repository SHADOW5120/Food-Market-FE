'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFavorites } from '@/lib/favorites-context';
import { useAuth } from '@/lib/auth-context';
import { FavoriteList } from '@/components/favorite/FavoriteList';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function FavoritesPageContent() {
  const { favorites, isLoading, loadFavorites } = useFavorites();
  const { user } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setPageLoading(true);
      try {
        await loadFavorites();
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [loadFavorites]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-3xl">🍽️</div>
              <h1 className="text-2xl font-bold text-gray-900">Food Market</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-orange-600 font-medium">
                Menu
              </Link>
              <Link href="/favorites" className="text-orange-600 hover:text-orange-700 font-medium">
                Favorites
              </Link>
              {user && (
                <Link href="/profile" className="text-gray-700 hover:text-orange-600 font-medium">
                  Profile
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">Favorites</li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">My Favorites</h1>
          <p className="text-gray-600 text-lg">
            {favorites.length > 0
              ? `You have ${favorites.length} favorite item${favorites.length !== 1 ? 's' : ''}`
              : 'Your favorite products will appear here'}
          </p>
        </div>

        {/* Favorites List */}
        <FavoriteList favorites={favorites} isLoading={pageLoading || isLoading} />

        {/* Action Buttons */}
        {favorites.length > 0 && (
          <div className="mt-12 flex gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => router.push('/products')}
              className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesPageContent />
    </ProtectedRoute>
  );
}

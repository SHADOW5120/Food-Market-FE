'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { useFavorites } from '@/lib/favorites-context';
import { useAuth } from '@/lib/auth-context';
import { RequireAuthModal } from '@/components/favorite/RequireAuthModal';

interface FavoriteButtonProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  onToggle?: (isFavorited: boolean) => void;
}

export function FavoriteButton({
  product,
  className = '',
  size = 'md',
  variant = 'icon',
  onToggle,
}: FavoriteButtonProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isFav = isFavorited(product.id);

  const handleToggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const success = await toggleFavorite(product);
      if (success) {
        onToggle?.(!isFav);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  };

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className={`inline-flex items-center justify-center transition-all duration-200 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          } ${className}`}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav ? (
            <svg
              className={`${sizeClasses[size]} text-red-500 fill-current`}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          ) : (
            <svg
              className={`${sizeClasses[size]} text-gray-400 hover:text-red-500`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          )}
        </button>
      ) : (
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isFav
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav ? (
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          )}
          {isLoading ? 'Loading...' : isFav ? 'Favorited' : 'Add to Favorites'}
        </button>
      )}

      <RequireAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

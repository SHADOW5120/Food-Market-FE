'use client';

import { useFavorites } from '@/lib/favorites-context';
import { ProductCard } from '@/components/product/ProductCard';
import { Favorite } from '@/lib/types';
import { useState } from 'react';

interface FavoriteListProps {
  favorites: Favorite[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function FavoriteList({
  favorites,
  isLoading = false,
  emptyMessage = 'No favorites yet. Start adding your favorite products!',
}: FavoriteListProps) {
  const { removeFavorite } = useFavorites();
  const [localFavorites, setLocalFavorites] = useState(favorites);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemoveFavorite = async (productId: string) => {
    setIsRemoving(productId);
    try {
      const success = await removeFavorite(productId);
      if (success) {
        setLocalFavorites(prev => prev.filter(fav => fav.productId !== productId));
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-xl shadow-sm border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-muted"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (localFavorites.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">ðŸ’”</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Favorites Yet</h3>
        <p className="text-muted-foreground mb-6">{emptyMessage}</p>
        <a
          href="/products"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary transition-colors"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {localFavorites.map((favorite) => (
        <div
          key={favorite.id}
          className="group bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))]"
        >
          <div className="aspect-square relative overflow-hidden bg-muted">
            {/* Remove button on hover */}
            <div className="absolute inset-0 bg-muted/0 group-hover:bg-muted/30 transition-colors duration-200 flex items-center justify-center">
              <button
                onClick={() => handleRemoveFavorite(favorite.productId)}
                disabled={isRemoving === favorite.productId}
                className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 py-2 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:bg-destructive transition-colors ${
                  isRemoving === favorite.productId
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {isRemoving === favorite.productId ? 'Removing...' : 'Remove'}
              </button>
            </div>

            {favorite.product.image ? (
              <img
                src={favorite.product.image}
                alt={favorite.product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            {favorite.product.status === 'unavailable' && (
              <div className="absolute inset-0 bg-muted/60 flex items-center justify-center">
                <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Unavailable
                </span>
              </div>
            )}
          </div>

          <div className="p-4">
            <a
              href={`/products/${favorite.productId}`}
              className="block group/link"
            >
              <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-2 group-hover/link:text-primary transition-colors mb-2">
                {favorite.product.name}
              </h3>
            </a>

            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-primary">
                ${favorite.product.price.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {favorite.product.categoryId}
              </span>
            </div>

            <a
              href={`/products/${favorite.productId}`}
              className="block w-full px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary transition-colors text-center"
            >
              View Details
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}




'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Favorite, Product } from './types';
import { getFavorites, addToFavorites, removeFromFavorites } from './api';

interface FavoritesContextType {
  favorites: Favorite[];
  favoriteIds: Set<string>;
  isLoading: boolean;
  isFavorited: (productId: string) => boolean;
  toggleFavorite: (product: Product) => Promise<boolean>;
  addFavorite: (product: Product) => Promise<boolean>;
  removeFavorite: (productId: string) => Promise<boolean>;
  loadFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, hasHydrated } = useAuth();

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);

    try {
      const response = await getFavorites();

      if (response.success && response.data) {
        setFavorites(response.data);
        setFavoriteIds(new Set(response.data.map(fav => fav.productId)));
      }
    } catch (error) {
      console.error('Failed to load favorites', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated) return;

    loadFavorites();
  }, [hasHydrated, isAuthenticated]);

  const isFavorited = (productId: string): boolean => {
    return favoriteIds.has(productId);
  };

  const toggleFavorite = async (product: Product): Promise<boolean> => {
    const isFav = isFavorited(product.id);
    if (isFav) {
      return removeFavorite(product.id);
    } else {
      return addFavorite(product);
    }
  };

  const addFavorite = async (product: Product): Promise<boolean> => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      const response = await addToFavorites(product.id);
      if (response.success && response.data) {
        const favoriteData = response.data;
        setFavorites(prev => {
          const exists = prev.some(fav => fav.productId === product.id);
          if (exists) return prev;
          return [...prev, favoriteData];
        });
        setFavoriteIds(prev => new Set([...prev, product.id]));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add favorite', error);
      return false;
    }
  };

  const removeFavorite = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      const response = await removeFromFavorites(productId);
      if (response.success) {
        setFavorites(prev => prev.filter(fav => fav.productId !== productId));
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove favorite', error);
      return false;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isLoading,
        isFavorited,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        loadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}

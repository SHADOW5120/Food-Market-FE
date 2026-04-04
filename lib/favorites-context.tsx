'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadInitialFavorites = async () => {
      setIsLoading(true);
      try {
        // Check if user is logged in
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Load from API if logged in
          const response = await getFavorites();
          if (response.success && response.data) {
            setFavorites(response.data);
            const ids = new Set(response.data.map(fav => fav.productId));
            setFavoriteIds(ids);
          }
        } else {
          // Load from localStorage if not logged in
          const stored = localStorage.getItem('favorites');
          if (stored) {
            try {
              const parsedIds = JSON.parse(stored);
              setFavoriteIds(new Set(parsedIds));
            } catch (error) {
              console.error('Failed to parse favorites from localStorage', error);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load favorites', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialFavorites();
  }, []);

  // Persist favoriteIds to localStorage whenever they change
  useEffect(() => {
    if (favoriteIds.size > 0) {
      localStorage.setItem('favorites', JSON.stringify(Array.from(favoriteIds)));
    } else {
      localStorage.removeItem('favorites');
    }
  }, [favoriteIds]);

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
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // User is logged in, sync with backend
        const response = await addToFavorites(product.id);
        if (response.success && response.data) {
          const favoriteData = response.data;
          // Update local state with the favorite from backend
          setFavorites(prev => {
            const exists = prev.some(fav => fav.productId === product.id);
            if (exists) return prev;
            return [...prev, favoriteData];
          });
          setFavoriteIds(prev => new Set([...prev, product.id]));
          return true;
        }
        return false;
      } else {
        // User is not logged in, just update local state
        setFavoriteIds(prev => new Set([...prev, product.id]));
        return true;
      }
    } catch (error) {
      console.error('Failed to add favorite', error);
      return false;
    }
  };

  const removeFavorite = async (productId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // User is logged in, sync with backend
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
      } else {
        // User is not logged in, just update local state
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        return true;
      }
    } catch (error) {
      console.error('Failed to remove favorite', error);
      return false;
    }
  };

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await getFavorites();
        if (response.success && response.data) {
          setFavorites(response.data);
          const ids = new Set(response.data.map(fav => fav.productId));
          setFavoriteIds(ids);
        }
      }
    } catch (error) {
      console.error('Failed to load favorites', error);
    } finally {
      setIsLoading(false);
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

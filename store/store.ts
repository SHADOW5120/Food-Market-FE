import { create } from 'zustand';
import { getStores, getStoreById, getStoreProducts } from '@/lib/api';
import type { Store, Product, Category } from '@/lib/types';

interface StoreState {
  stores: Store[];
  currentStore: Store | null;
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchStores: () => Promise<void>;
  fetchStoreById: (id: string) => Promise<void>;
  fetchStoreProducts: (id: string) => Promise<void>;
  setCurrentStore: (store: Store | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  stores: [],
  currentStore: null,
  products: [],
  categories: [],
  loading: false,
  error: null,

  fetchStores: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getStores();
      if (response.success && response.data) {
        set({ stores: response.data.items || [], loading: false });
      } else {
        set({ error: response.error || 'Failed to fetch stores', loading: false });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  fetchStoreById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await getStoreById(id);
      if (response.success) {
        set({ currentStore: response.data || null, loading: false });
      } else {
        set({ error: response.error || 'Failed to fetch store', loading: false });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  fetchStoreProducts: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await getStoreProducts(id);
      if (response.success) {
        set({
          products: response.data?.products || [],
          categories: response.data?.categories || [],
          loading: false
        });
      } else {
        set({ error: response.error || 'Failed to fetch store products', loading: false });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  setCurrentStore: (store) => set({ currentStore: store }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
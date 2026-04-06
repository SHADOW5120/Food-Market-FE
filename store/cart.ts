import { create } from 'zustand';
import type { CartItem, Product } from '@/lib/types';

interface CartState {
  items: CartItem[];
  storeId: string | null;

  // Actions
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  storeId: null,

  addItem: async (product: Product, quantity = 1) => {
    const { items, storeId } = get();

    // Check if cart has items from another store
    if (storeId && storeId !== product.storeId) {
      const confirmClear = window.confirm(
        'Your cart contains items from another store. Clear cart and add new item?'
      );
      if (!confirmClear) return;

      // Clear cart and set new store
      set({ items: [], storeId: product.storeId });
    } else if (!storeId) {
      // Set store for empty cart
      set({ storeId: product.storeId });
    }

    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      // Update quantity
      const updatedItems = items.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.product.price }
          : item
      );
      set({ items: updatedItems });
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`, // Simple ID generation
        product,
        quantity,
        subtotal: quantity * product.price,
      };
      set({ items: [...items, newItem] });
    }

    // Show feedback (you can integrate with toast library here)
    console.log('Item added to cart');
  },

  removeItem: (itemId: string) => {
    const { items } = get();
    const updatedItems = items.filter(item => item.id !== itemId);

    // If cart becomes empty, reset storeId
    const newStoreId = updatedItems.length > 0 ? get().storeId : null;

    set({ items: updatedItems, storeId: newStoreId });
  },

  updateQuantity: (itemId: string, quantity: number) => {
    const { items } = get();

    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    const updatedItems = items.map(item =>
      item.id === itemId
        ? { ...item, quantity, subtotal: quantity * item.product.price }
        : item
    );

    set({ items: updatedItems });
  },

  clearCart: () => set({ items: [], storeId: null }),

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.subtotal, 0);
  },
}));
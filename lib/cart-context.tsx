'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, Product } from './types';

interface CartContextType {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  isLoading: boolean;
  
  // Actions
  addItem: (product: Product, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Utilities
  getCartItem: (productId: string) => CartItem | undefined;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadInitialCart = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // User is logged in - could load from backend here
          // For now, we'll use localStorage
          const stored = localStorage.getItem('cart');
          if (stored) {
            try {
              setItems(JSON.parse(stored));
            } catch (error) {
              console.error('Failed to parse cart from localStorage', error);
            }
          }
        } else {
          // Load from localStorage for non-authenticated users
          const stored = localStorage.getItem('cart');
          if (stored) {
            try {
              setItems(JSON.parse(stored));
            } catch (error) {
              console.error('Failed to parse cart from localStorage', error);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load cart', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialCart();
  }, []);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('cart');
    }
  }, [items]);

  const getCartItem = useCallback(
    (productId: string): CartItem | undefined => {
      return items.find(item => item.product.id === productId);
    },
    [items]
  );

  const addItem = async (product: Product, quantity: number): Promise<void> => {
    if (quantity < 1) return;

    setItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);

      if (existingItem) {
        // Update quantity if product already in cart
        return prev.map(item =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * product.price,
              }
            : item
        );
      } else {
        // Add new item to cart
        return [
          ...prev,
          {
            id: `${product.id}-${Date.now()}`,
            product,
            quantity,
            subtotal: quantity * product.price,
          },
        ];
      }
    });
  };

  const removeItem = async (cartItemId: string): Promise<void> => {
    setItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = async (cartItemId: string, quantity: number): Promise<void> => {
    if (quantity < 1) {
      // Remove item if quantity becomes 0
      await removeItem(cartItemId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === cartItemId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.product.price,
            }
          : item
      )
    );
  };

  const clearCart = async (): Promise<void> => {
    setItems([]);
  };

  const loadCart = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load cart', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalPrice,
        totalItems,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartItem,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

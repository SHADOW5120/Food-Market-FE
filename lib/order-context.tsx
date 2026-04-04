'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Order } from './types';
import { getUserOrders, getUserOrderById } from './api';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadOrders: () => Promise<void>;
  loadOrderDetail: (orderId: string) => Promise<void>;
  clearOrderDetail: () => void;
  clearError: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export interface OrderProviderProps {
  children: React.ReactNode;
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all orders for the current user
   */
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserOrders();

      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setError(response.error || 'Failed to load orders');
      }
    } catch (err) {
      setError('An error occurred while loading orders');
      console.error('Load orders error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load order details by ID
   */
  const loadOrderDetail = async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserOrderById(orderId);

      if (response.success && response.data) {
        setCurrentOrder(response.data);
      } else {
        setError(response.error || 'Failed to load order');
      }
    } catch (err) {
      setError('An error occurred while loading order');
      console.error('Load order detail error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear current order detail
   */
  const clearOrderDetail = () => {
    setCurrentOrder(null);
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  const value: OrderContextType = {
    orders,
    currentOrder,
    isLoading,
    error,
    loadOrders,
    loadOrderDetail,
    clearOrderDetail,
    clearError,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

/**
 * Hook to use Order Context
 */
export function useOrder(): OrderContextType {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}

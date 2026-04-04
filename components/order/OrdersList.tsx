'use client';

import { OrderCard } from './OrderCard';
import type { Order } from '@/lib/types';

interface OrdersListProps {
  orders: Order[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function OrdersList({
  orders,
  isLoading = false,
  emptyMessage = 'No orders found',
}: OrdersListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
        <p className="text-gray-400 mt-2">Place your first order today!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

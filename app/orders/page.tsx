'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { OrdersList } from '@/components/order/OrdersList';
import { useAuth } from '@/lib/auth-context';
import { useOrder } from '@/lib/order-context';
import type { Order } from '@/lib/types';

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';

export default function OrdersPage() {
  const { orders, isLoading, error, loadOrders } = useOrder();
  const { isAuthenticated } = useAuth();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === filterStatus));
    }
  }, [orders, filterStatus]);

  const statuses = [
    { value: 'all' as FilterStatus, label: 'All Orders', count: orders.length },
    { value: 'pending' as FilterStatus, label: 'Pending', count: orders.filter((o) => o.status === 'pending').length },
    { value: 'confirmed' as FilterStatus, label: 'Confirmed', count: orders.filter((o) => o.status === 'confirmed').length },
    { value: 'delivering' as FilterStatus, label: 'Delivering', count: orders.filter((o) => o.status === 'delivering').length },
    { value: 'completed' as FilterStatus, label: 'Completed', count: orders.filter((o) => o.status === 'completed').length },
    { value: 'cancelled' as FilterStatus, label: 'Cancelled', count: orders.filter((o) => o.status === 'cancelled').length },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
              <Link
                href="/"
                className="bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-700 transition-colors text-center w-full sm:w-auto"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Message */}
          {error && !isLoading && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mb-8 bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <div className="flex">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFilterStatus(status.value)}
                  className={`flex-1 min-w-max px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                    filterStatus === status.value
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="hidden sm:inline">{status.label}</span>
                  <span className="sm:hidden">{status.label.split(' ')[0]}</span>
                  <span className="ml-2 text-gray-500">({status.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <OrdersList
            orders={filteredOrders}
            isLoading={isLoading}
            emptyMessage={
              filterStatus === 'all'
                ? 'No orders yet'
                : `No ${statuses.find((s) => s.value === filterStatus)?.label.toLowerCase()} orders`
            }
          />
        </div>

        {/* Bottom Call to Action */}
        {orders.length === 0 && !isLoading && !error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start browsing our menu and place your first order today!</p>
            <Link
              href="/"
              className="inline-block bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { OrderSummary } from '@/components/order/OrderSummary';
import type { Order } from '@/lib/types';
import { getUserOrderById } from '@/lib/api';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getUserOrderById(orderId);

        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError(response.error || 'Failed to load order');
        }
      } catch (err) {
        setError('An error occurred while loading the order');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          {error ? (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
              <p className="text-red-600 mb-4">{error}</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully! 🎉</h1>
              <p className="text-gray-600 text-lg">Thank you for your order. We're preparing it now.</p>
            </>
          )}
        </div>

        {/* Order Details */}
        {order && !error && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              {/* Order Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Number</p>
                    <p className="text-2xl font-bold text-orange-600">#{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Address</h3>
                <div className="text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{order.customer.name}</p>
                  <p>{order.deliveryAddress.street}</p>
                  <p>
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zip}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">Phone: {order.customer.phone}</p>
                </div>
              </div>

              {/* Items Count */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{order.items.length}</span> item{order.items.length !== 1 ? 's' : ''} ordered
                </p>
              </div>

              {/* Order Summary */}
              <OrderSummary
                subtotal={order.subtotal}
                deliveryFee={order.deliveryFee}
                tax={order.tax}
                total={order.total}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/orders"
            className="flex-1 bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors text-center"
          >
            View All Orders
          </Link>
          <Link
            href="/"
            className="flex-1 bg-white text-orange-600 font-semibold py-3 px-6 rounded-lg border border-orange-600 hover:bg-orange-50 transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>

        {/* Additional Info */}
        {!error && (
          <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-blue-900">
              📧 A confirmation email has been sent to <strong>{order?.customer.email}</strong>. You'll receive updates about your order status via email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </ProtectedRoute>
  );
}

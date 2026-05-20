'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StatusBadge } from '@/components/seller/StatusBadge';
import { OrderItem } from '@/components/order/OrderItem';
import { OrderSummary } from '@/components/order/OrderSummary';
import { useOrder } from '@/lib/order-context';
import { cancelOrder } from '@/lib/api';
import type { Order } from '@/lib/types';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentOrder, loadOrderDetail, isLoading, error } = useOrder();
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    if (orderId) {
      loadOrderDetail(orderId);
    }
  }, [orderId]);

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      setCancelError(null);
      const response = await cancelOrder(orderId);

      if (response.success) {
        // Reload order to get updated status
        await loadOrderDetail(orderId);
        setShowCancelConfirm(false);
      } else {
        setCancelError(response.error || 'Failed to cancel order');
      }
    } catch (err) {
      setCancelError('An error occurred while cancelling the order');
      console.error('Error:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancelOrder = currentOrder?.status === 'pending' || currentOrder?.status === 'confirmed';

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-muted flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full border-4 border-[color:hsl(var(--border))] border-t-orange-600 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !currentOrder) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-muted py-8 px-4">
          <div className="max-w-2xl mx-auto bg-card rounded-lg p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-destructive"
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
            <p className="text-muted-foreground mb-4">{error || 'Order not found'}</p>
            <Link
              href="/orders"
              className="text-accent hover:text-accent font-semibold"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const order = currentOrder;
  const orderDate = order.createdAt ? new Date(order.createdAt) : null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted">
        {/* Header */}
        <div className="bg-card border-b border-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-muted-foreground">Order #{order.orderNumber}</h1>
                <p className="text-muted-foreground mt-1">
                  {orderDate ? (
                    orderDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  ) : (
                    'Unknown date'
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={order.status} className="text-base px-4 py-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Alert */}
          {cancelError && (
            <div className="mb-6 bg-destructive border border-destructive/40 text-destructive px-4 py-3 rounded-lg">
              {cancelError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-card rounded-lg p-6 border border-muted">
                <h2 className="text-xl font-semibold text-muted-foreground mb-4">Customer Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-semibold text-muted-foreground">{order.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold text-muted-foreground">{order.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold text-muted-foreground">{order.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card rounded-lg p-6 border border-muted">
                <h2 className="text-xl font-semibold text-muted-foreground mb-4">Delivery Address</h2>
                <div className="text-muted-foreground space-y-1">
                  <p>{order.deliveryAddress.street}</p>
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zip}</p>
                  {order.notes && (
                    <>
                      <p className="mt-4 font-semibold text-muted-foreground">Special Instructions:</p>
                      <p className="text-muted-foreground">{order.notes}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-card rounded-lg p-6 border border-muted">
                <h2 className="text-xl font-semibold text-muted-foreground mb-4">Order Items</h2>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <OrderItem key={item.id} item={item} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} in this order
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-card rounded-lg p-6 border border-muted">
                <h2 className="text-xl font-semibold text-muted-foreground mb-4">Order Summary</h2>
                <OrderSummary
                  subtotal={order.subtotal}
                  deliveryFee={order.deliveryFee}
                  tax={order.tax}
                  total={order.total}
                />
              </div>

              {/* Status Timeline */}
              <div className="bg-card rounded-lg p-6 border border-muted">
                <h2 className="text-xl font-semibold text-muted-foreground mb-4">Status Timeline</h2>
                <div className="space-y-4">
                  {/* Pending */}
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      ['pending', 'confirmed', 'delivering', 'completed'].includes(order.status)
                        ? 'bg-success text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-muted-foreground">Order Placed</p>
                      <p className="text-xs text-muted-foreground">
                        {orderDate ? orderDate.toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                  </div>

                  {/* Confirmed */}
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      ['confirmed', 'delivering', 'completed'].includes(order.status)
                        ? 'bg-success text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {['confirmed', 'delivering', 'completed'].includes(order.status) ? '✓' : '⊙'}
                    </div>
                    <div>
                      <p className="font-semibold text-muted-foreground">Confirmed</p>
                      <p className="text-xs text-muted-foreground">Restaurant is preparing</p>
                    </div>
                  </div>

                  {/* Delivering */}
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      ['delivering', 'completed'].includes(order.status)
                        ? 'bg-success text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {['delivering', 'completed'].includes(order.status) ? '✓' : '⊙'}
                    </div>
                    <div>
                      <p className="font-semibold text-muted-foreground">On the Way</p>
                      <p className="text-xs text-muted-foreground">Out for delivery</p>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      order.status === 'completed'
                        ? 'bg-success text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {order.status === 'completed' ? '✓' : '⊙'}
                    </div>
                    <div>
                      <p className="font-semibold text-muted-foreground">Delivered</p>
                      <p className="text-xs text-muted-foreground">Order completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {canCancelOrder && (
                  <>
                    {!showCancelConfirm ? (
                      <button
                        onClick={() => setShowCancelConfirm(true)}
                        className="w-full bg-destructive text-destructive-foreground font-semibold py-2 px-4 rounded-lg hover:bg-destructive transition-colors"
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <div className="bg-destructive border border-destructive/40 rounded-lg p-4">
                        <p className="text-sm text-destructive font-semibold mb-3">Are you sure you want to cancel this order?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCancelOrder}
                            disabled={isCancelling}
                            className="flex-1 bg-destructive text-destructive-foreground font-semibold py-2 px-4 rounded-lg hover:bg-destructive transition-colors disabled:opacity-50"
                          >
                            {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                          </button>
                          <button
                            onClick={() => setShowCancelConfirm(false)}
                            disabled={isCancelling}
                            className="flex-1 bg-card text-destructive font-semibold py-2 px-4 rounded-lg border border-destructive/40 hover:bg-destructive transition-colors"
                          >
                            Keep Order
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <Link
                  href="/orders"
                  className="w-full bg-muted text-muted-foreground font-semibold py-2 px-4 rounded-lg hover:bg-accent transition-colors text-center block"
                >
                  Back to Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

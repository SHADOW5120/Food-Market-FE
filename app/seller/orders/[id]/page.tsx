'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { StatusBadge } from '@/components/seller/StatusBadge';
import { Button } from '@/components/auth/Button';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'delivering' | 'completed';
  notes?: string;
  createdAt: string;
  estimatedDelivery?: string;
}

// Mock order details
const mockOrderDetail: OrderDetail = {
  id: '1',
  orderNumber: '#ORD-001',
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
  },
  deliveryAddress: {
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
  },
  items: [
    {
      id: '1',
      name: 'Margherita Pizza',
      quantity: 1,
      price: 12.99,
    },
    {
      id: '2',
      name: 'Caesar Salad',
      quantity: 2,
      price: 8.50,
    },
    {
      id: '3',
      name: 'Burger Combo',
      quantity: 1,
      price: 15.50,
    },
  ],
  subtotal: 45.49,
  tax: 3.64,
  deliveryFee: 2.99,
  total: 51.99,
  status: 'pending',
  notes: 'Please ring the doorbell twice. No onions on the salad.',
  createdAt: '2024-03-21T14:30:00',
  estimatedDelivery: '2024-03-21T15:30:00',
};

export default function OrderDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderDetail>(mockOrderDetail);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) {
      setShowStatusModal(false);
      return;
    }

    setIsUpdating(true);
    try {
      // TODO: Replace with actual API call
      // await updateOrderStatus(orderId, selectedStatus);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setOrder((prev) => ({ ...prev, status: selectedStatus as any }));
      setShowStatusModal(false);
    } catch (error) {
      console.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <SellerLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Please log in as a seller</p>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="text-success hover:text-success font-semibold mb-4"
          >
            ← Back to Orders
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-muted-foreground">{order.orderNumber}</h1>
              <p className="text-muted-foreground mt-1">Ordered {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <StatusBadge status={order.status} />
              <button
                onClick={() => setShowStatusModal(true)}
                className="mt-3 px-4 py-2 bg-secondary hover:bg-secondary text-secondary rounded-lg font-semibold transition-colors text-sm"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-card rounded-lg shadow border border-muted p-6">
              <h2 className="text-xl font-bold text-muted-foreground mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Name</p>
                  <p className="text-muted-foreground font-medium">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Email</p>
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="text-success hover:text-success font-medium"
                  >
                    {order.customer.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Phone</p>
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="text-success hover:text-success font-medium"
                  >
                    {order.customer.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-card rounded-lg shadow border border-muted p-6">
              <h2 className="text-xl font-bold text-muted-foreground mb-4">Delivery Address</h2>
              <div className="space-y-2">
                <p className="text-muted-foreground font-medium">{order.deliveryAddress.street}</p>
                <p className="text-muted-foreground">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zip}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card rounded-lg shadow border border-muted overflow-hidden">
              <div className="p-6 border-b border-muted">
                <h2 className="text-xl font-bold text-muted-foreground">Order Items</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex justify-between items-center hover:bg-accent transition-colors">
                    <div>
                      <p className="font-semibold text-muted-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-secondary rounded-lg border border-muted/50 p-6">
                <h3 className="font-semibold text-muted-foreground mb-2">Customer Notes</h3>
                <p className="text-muted-foreground text-sm">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow border border-muted p-6 sticky top-6 space-y-4">
              <h3 className="font-bold text-muted-foreground">Order Summary</h3>

              <div className="space-y-3 text-sm border-b border-muted pb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-muted-foreground">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-muted-foreground">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium text-muted-foreground">${order.deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-muted-foreground">Total</span>
                <span className="text-2xl font-bold text-success">${order.total.toFixed(2)}</span>
              </div>

              {order.estimatedDelivery && (
                <div className="bg-success rounded p-3 border border-success text-sm">
                  <p className="text-success font-semibold">
                    Est. Delivery: {new Date(order.estimatedDelivery).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowStatusModal(true)}
                className="w-full px-4 py-2 bg-success hover:bg-success text-success-foreground rounded-lg font-semibold transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-muted/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-bold text-muted-foreground mb-4">Update Order Status</h2>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-muted rounded-lg focus:border-success focus:outline-none mb-4"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivering">Delivering</option>
                <option value="completed">Completed</option>
              </select>

              <div className="flex gap-3">
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-success hover:bg-success text-success-foreground rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-muted hover:bg-accent text-muted-foreground rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}

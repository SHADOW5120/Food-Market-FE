'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { Button } from '@/components/auth/Button';
import { StatusBadge } from '@/components/seller/StatusBadge';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { sellerApi } from '@/lib/api';
import { Order } from '@/lib/types';
import toast from 'react-hot-toast';
import { USER_ROLES } from '@/lib/constants';

export default function SellerOrderDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const response = await sellerApi.getSellerOrderById(orderId);

      if (response.success && response.data) {
        setOrder(response.data);
        setNewStatus(response.data.status);
      } else {
        toast.error('Failed to load order');
      }
    } catch (error) {
      toast.error('Error loading order');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!order || newStatus === order.status) {
      toast.error('Please select a different status');
      return;
    }

    try {
      setIsUpdating(true);
      const response = await sellerApi.updateOrderStatus(orderId, {
        status: newStatus as 'confirmed' | 'delivering' | 'completed' | 'cancelled',
        notes: `Order status updated to ${newStatus}`,
      });

      if (response.success && response.data) {
        toast.success('Order status updated successfully');
        setOrder(response.data);
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      toast.error('Error updating order');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
        <SellerLayout user={user} storeName="My Store">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2" />
              <p className="text-muted-foreground">Loading order...</p>
            </div>
          </div>
        </SellerLayout>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
        <SellerLayout user={user} storeName="My Store">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Order not found</p>
          </div>
        </SellerLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
      <SellerLayout user={user} storeName="My Store">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-primary hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-foreground">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">Order placed on {new Date(order.createdAt || '').toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Order Items</h2>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h2>
                <div className="text-foreground space-y-1">
                  <p>{order.deliveryAddress?.street}</p>
                  <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zip}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Customer Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {order.customer?.email}
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {order.customer?.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Order Summary */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>${order.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax</span>
                    <span>${order.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Delivery Fee</span>
                    <span>${order.deliveryFee?.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-lg text-foreground">
                    <span>Total</span>
                    <span>${order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">Current Status</h3>
                <div className="mb-4">
                  <StatusBadge status={order.status} size="lg" />
                </div>

                <div className="space-y-3">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    disabled={isUpdating}
                    className="w-full px-3 py-2 rounded-lg border-2 border-border bg-input text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivering">Delivering</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <Button
                    onClick={handleUpdateStatus}
                    disabled={isUpdating || newStatus === order.status}
                    className="w-full"
                  >
                    {isUpdating ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SellerLayout>
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { Button } from '@/components/auth/Button';
import { Input } from '@/components/auth/Input';
import { StatusBadge } from '@/components/seller/StatusBadge';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { sellerApi, shouldRunOnce } from '@/lib/api';
import { Order } from '@/lib/types';
import toast from 'react-hot-toast';
import { USER_ROLES } from '@/lib/constants';

export default function SellerOrdersPage() {
  const { user, role, hasHydrated, isAuthenticated } = useAuth();
  const isSeller = role === USER_ROLES.SELLER;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!hasHydrated || !isSeller || !isAuthenticated || !user?.id) {
      setIsLoading(false);
      return;
    }

    const key = `orders:list:${user.id}:page:${page}:status:${statusFilter}`;
    if (!shouldRunOnce(key)) return;

    loadOrders();
  }, [page, statusFilter, hasHydrated, isSeller]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await sellerApi.getSellerOrders(page, 10, statusFilter);

      if (response.success && response.data?.items) {
        setOrders(response.data.items);
        setTotalPages(response.data.totalPages || 1);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      toast.error('Error loading orders');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
      <SellerLayout user={user} storeName="My Store">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders</p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by order ID or customer name..."
                icon={<Search className="w-4 h-4" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-lg border-2 border-border bg-input text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivering">Delivering</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2" />
                <p>Loading orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Total</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground">#{order.orderNumber}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-foreground">{order.customer?.name}</p>
                              <p className="text-xs text-muted-foreground">{order.customer?.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {new Date(order.createdAt || '').toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            ${order.total?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.status} size="sm" />
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/seller/orders/${order.id}`)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 py-4 border-t border-border flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No orders found</p>
              </div>
            )}
          </div>
        </div>
      </SellerLayout>
    </ProtectedRoute>
  );
}

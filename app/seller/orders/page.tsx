'use client';

import { Inbox } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { StatusBadge } from '@/components/seller/StatusBadge';
import { sellerApi } from '@/lib/api';
import { Order } from '@/lib/types';
import toast from 'react-hot-toast';

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    total: 45.99,
    status: 'pending',
    items: 3,
    date: '2024-03-21',
  },
  {
    id: '2',
    orderNumber: '#ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    total: 62.50,
    status: 'confirmed',
    items: 2,
    date: '2024-03-20',
  },
  {
    id: '3',
    orderNumber: '#ORD-003',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    total: 28.99,
    status: 'delivering',
    items: 1,
    date: '2024-03-20',
  },
  {
    id: '4',
    orderNumber: '#ORD-004',
    customer: 'Sarah Williams',
    email: 'sarah@example.com',
    total: 89.00,
    status: 'completed',
    items: 4,
    date: '2024-03-19',
  },
  {
    id: '5',
    orderNumber: '#ORD-005',
    customer: 'Robert Brown',
    email: 'robert@example.com',
    total: 34.50,
    status: 'pending',
    items: 2,
    date: '2024-03-19',
  },
];

const statusOptions = ['All', 'pending', 'confirmed', 'delivering', 'completed'];

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const status = statusFilter === 'All' ? undefined : statusFilter;
        const response = await sellerApi.getSellerOrders(currentPage, 10, status);
        
        if (response.success && response.data) {
          setOrders(response.data.items);
          setTotalPages(response.data.totalPages);
        } else {
          toast.error('Failed to load orders');
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, statusFilter, currentPage]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const handleStatusUpdate = async (orderId: string) => {
    if (!newStatus) return;
    try {
      const response = await sellerApi.updateOrderStatus(orderId, { status: newStatus as Order['status'] });
      if (response.success) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
        ));
        toast.success('Order status updated successfully');
        setSelectedOrder(null);
        setNewStatus('');
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground mt-1">{filteredOrders.length} order(s) found</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-card rounded-lg shadow border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] p-4 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by customer, email, or order #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-xs px-4 py-2 border-2 border-[color:hsl(var(--border))] rounded-lg focus:border-success focus:outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border-2 border-[color:hsl(var(--border))] rounded-lg focus:border-success focus:outline-none"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="bg-card rounded-lg shadow border border-border p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-card rounded-lg shadow border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="text-muted-foreground">No orders found</p>
            {searchQuery || statusFilter !== 'All' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                }}
                className="text-success hover:text-success font-semibold mt-4"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-[color:hsl(var(--border))]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Order #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{order.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.items.length} items</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm space-y-2">
                        <div className="flex gap-2">
                          <Link href={`/seller/orders/${order.id}`}>
                            <button className="px-3 py-1 text-xs bg-success hover:bg-success text-success-foreground rounded font-semibold transition-colors">
                              View Details
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedOrder(order.id);
                              setNewStatus(order.status);
                            }}
                            className="px-3 py-1 text-xs bg-secondary hover:bg-secondary text-secondary rounded font-semibold transition-colors"
                          >
                            Update Status
                          </button>
                        </div>

                        {/* Status Update Modal */}
                        {selectedOrder === order.id && (
                          <div className="fixed inset-0 bg-muted/60 flex items-center justify-center z-50 p-4">
                            <div className="bg-card rounded-lg shadow-lg p-6 max-w-sm w-full">
                              <h2 className="text-lg font-bold text-foreground mb-4">
                                Update Order Status
                              </h2>

                              <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-[color:hsl(var(--border))] rounded-lg focus:border-success focus:outline-none mb-4"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="delivering">Delivering</option>
                                <option value="completed">Completed</option>
                              </select>

                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleStatusUpdate(order.id)}
                                  className="flex-1 px-4 py-2 bg-success hover:bg-success text-success-foreground rounded-lg font-semibold transition-colors"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedOrder(null);
                                    setNewStatus('');
                                  }}
                                  className="flex-1 px-4 py-2 bg-muted hover:bg-muted text-foreground rounded-lg font-semibold transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}





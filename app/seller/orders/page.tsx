'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { StatusBadge } from '@/components/seller/StatusBadge';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'confirmed' | 'delivering' | 'completed';
  items: number;
  date: string;
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const handleStatusUpdate = async (orderId: string) => {
    if (!newStatus) return;
    try {
      // TODO: Replace with actual API call
      // await updateOrderStatus(orderId, newStatus);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSelectedOrder(null);
      setNewStatus('');
      // Update would happen here in real implementation
    } catch (error) {
      console.error('Failed to update order status');
    }
  };

  if (!user) {
    return (
      <SellerLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Please log in as a seller</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">{filteredOrders.length} order(s) found</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by customer, email, or order #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-xs px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-gray-600">No orders found</p>
            {searchQuery || statusFilter !== 'All' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                }}
                className="text-green-600 hover:text-green-700 font-semibold mt-4"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Order #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.items} items</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm space-y-2">
                        <div className="flex gap-2">
                          <Link href={`/seller/orders/${order.id}`}>
                            <button className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors">
                              View Details
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedOrder(order.id);
                              setNewStatus(order.status);
                            }}
                            className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-semibold transition-colors"
                          >
                            Update Status
                          </button>
                        </div>

                        {/* Status Update Modal */}
                        {selectedOrder === order.id && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                              <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Update Order Status
                              </h2>

                              <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none mb-4"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="delivering">Delivering</option>
                                <option value="completed">Completed</option>
                              </select>

                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleStatusUpdate(order.id)}
                                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedOrder(null);
                                    setNewStatus('');
                                  }}
                                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors"
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { StatCard } from '@/components/seller/StatCard';
import { StatusBadge } from '@/components/seller/StatusBadge';
import { Button } from '@/components/auth/Button';

export default function SellerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with API calls
  const stats = {
    totalOrders: 24,
    revenue: '$2,450',
    totalProducts: 18,
    avgRating: 4.8,
  };

  const recentOrders = [
    {
      id: '001',
      customer: 'John Doe',
      total: '$45.99',
      status: 'confirmed' as const,
      date: '2024-03-21',
    },
    {
      id: '002',
      customer: 'Jane Smith',
      total: '$32.50',
      status: 'delivering' as const,
      date: '2024-03-21',
    },
    {
      id: '003',
      customer: 'Mike Johnson',
      total: '$67.20',
      status: 'completed' as const,
      date: '2024-03-20',
    },
  ];

  const handleAddProduct = () => {
    router.push('/seller/products/new');
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
    <SellerLayout user={user} storeName="My Store">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.username}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="🛒"
            trend={{ value: 12, direction: 'up' }}
            onClick={() => router.push('/seller/orders')}
          />
          <StatCard
            title="Revenue"
            value={stats.revenue}
            icon="💰"
            trend={{ value: 8, direction: 'up' }}
          />
          <StatCard
            title="Products"
            value={stats.totalProducts}
            icon="📦"
            onClick={() => router.push('/seller/products')}
          />
          <StatCard
            title="Avg Rating"
            value={stats.avgRating}
            icon="⭐"
            trend={{ value: 2, direction: 'up' }}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="primary"
              onClick={handleAddProduct}
              className="text-sm"
            >
              ➕ Add Product
            </Button>
            <Link href="/seller/products" className="block">
              <button className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors">
                📦 Manage Products
              </button>
            </Link>
            <Link href="/seller/orders" className="block">
              <button className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors">
                🛒 View Orders
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {order.total}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/seller/orders/${order.id}`}>
                        <button className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <Link href="/seller/orders">
              <button className="text-green-600 hover:text-green-700 font-semibold">
                View all orders →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

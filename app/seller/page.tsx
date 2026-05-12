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
          <p className="text-muted-foreground">Please log in as a seller</p>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout user={user} storeName="My Store">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.username}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="ðŸ›’"
            trend={{ value: 12, direction: 'up' }}
            onClick={() => router.push('/seller/orders')}
          />
          <StatCard
            title="Revenue"
            value={stats.revenue}
            icon="ðŸ’°"
            trend={{ value: 8, direction: 'up' }}
          />
          <StatCard
            title="Products"
            value={stats.totalProducts}
            icon="ðŸ“¦"
            onClick={() => router.push('/seller/products')}
          />
          <StatCard
            title="Avg Rating"
            value={stats.avgRating}
            icon="â­"
            trend={{ value: 2, direction: 'up' }}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg shadow p-6 border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))]">
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="primary"
              onClick={handleAddProduct}
              className="text-sm"
            >
              âž• Add Product
            </Button>
            <Link href="/seller/products" className="block">
              <button className="w-full px-4 py-3 bg-secondary hover:bg-secondary text-secondary-foreground rounded-lg font-semibold transition-colors">
                ðŸ“¦ Manage Products
              </button>
            </Link>
            <Link href="/seller/orders" className="block">
              <button className="w-full px-4 py-3 bg-secondary hover:bg-secondary text-secondary-foreground rounded-lg font-semibold transition-colors">
                ðŸ›’ View Orders
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-lg shadow border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] overflow-hidden">
          <div className="p-6 border-b border-[color:hsl(var(--border))]">
            <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-[color:hsl(var(--border))]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{order.customer}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      {order.total}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/seller/orders/${order.id}`}>
                        <button className="text-success hover:text-success font-semibold transition-colors">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-[color:hsl(var(--border))] border-[color:hsl(var(--border))]">
            <Link href="/seller/orders">
              <button className="text-success hover:text-success font-semibold">
                View all orders â†’
              </button>
            </Link>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}





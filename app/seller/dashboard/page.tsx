'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, DollarSign, Package, Plus, ShoppingCart, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { StatCard } from '@/components/seller/StatCard';
import { StatusBadge } from '@/components/seller/StatusBadge';
import { ChartCard } from '@/components/seller/ChartCard';
import { SimpleBarChart, SimpleLineChart } from '@/components/seller/Charts';
import { Button } from '@/components/auth/Button';
import { sellerApi, shouldRunOnce } from '@/lib/api';
import { getFakeStores, getFakeProducts, getFakeDashboardStats } from '@/lib/fakeData';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';
import type { SellerDashboardStats } from '@/lib/types';
import { USER_ROLES } from '@/lib/constants';

interface DashboardStats extends SellerDashboardStats {}

export default function SellerDashboard() {
  const { user, role, hasHydrated, isAuthenticated } = useAuth();
  const isSeller = role === USER_ROLES.SELLER;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    activeProducts: 0,
    averageRating: 4.8,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [storeName, setStoreName] = useState('My Store');
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const previewProducts = getFakeProducts(selectedStoreId).slice(0, 4);

  useEffect(() => {
    if (!hasHydrated || !isSeller) {
      return;
    }
    loadDashboardData();
    // load seller stores for optional per-store selection
    const loadStores = async () => {
      try {
        if (!user) return;
        const res = await sellerApi.getSellerStores(user.id);
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setStores(res.data);
          if (res.data.length === 1) {
            setSelectedStoreId(res.data[0].id);
            setStoreName(res.data[0].name);
          }
        } else {
          // Fallback to fake stores so the UI looks populated in dev
          const fake = getFakeStores();
          setStores(fake);
          if (fake.length > 0 && !selectedStoreId) {
            setSelectedStoreId(fake[0].id);
            setStoreName(fake[0].name);
          }
        }
      } catch (err) {
        console.error('Failed to load seller stores', err);
      }
    };

    if (!isAuthenticated || !user?.id) return;
    const key = `dashboard:stores:${user.id}`;
    if (shouldRunOnce(key)) loadStores();
  }, [hasHydrated, isSeller]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load stats from correct endpoint
      const statsRes = await sellerApi.getDashboardSummary();
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
        setStoreName(user?.username || 'My Store');
      }

      // Load analytics data
      const analyticsRes = await sellerApi.getAnalytics('month');
      if (analyticsRes.success && analyticsRes.data) {
        setRevenueData(
          analyticsRes.data.map((item) => ({
            label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: item.revenue,
          }))
        );
      }

      // Load recent orders
      const ordersRes = await sellerApi.getSellerOrders(1, 5);
      if (ordersRes.success && ordersRes.data?.items) {
        setRecentOrders(ordersRes.data.items);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
      <SellerLayout user={user} storeName={storeName}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.username}!</p>
            </div>
            <div className="flex items-center gap-4">
              {stores.length > 0 && (
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-input text-foreground"
                >
                  <option value="">All stores</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
              <Link href="/seller/products/new">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingCart className="w-6 h-6 text-success" />}
              trend={{ value: 12, direction: 'up' }}
              onClick={() => router.push('/seller/orders')}
            />
            <StatCard
              title="Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6 text-success" />}
              trend={{ value: 8, direction: 'up' }}
            />
            <StatCard
              title="Products"
              value={stats.totalProducts}
              icon={<Package className="w-6 h-6 text-primary" />}
              onClick={() => router.push('/seller/products')}
            />
            <StatCard
              title="Avg Rating"
              value={stats.averageRating}
              icon={<Star className="w-6 h-6 text-yellow-500" />}
              trend={{ value: 2, direction: 'up' }}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Revenue Trend (Last 30 Days)" isLoading={isLoading}>
              {revenueData.length > 0 ? (
                <SimpleLineChart data={revenueData} height={300} />
              ) : (
                <div className="h-300 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </ChartCard>

            <ChartCard title="Order Status Distribution" isLoading={isLoading}>
              <SimpleBarChart
                data={[
                  { label: 'Pending', value: 12, color: 'bg-yellow-500' },
                  { label: 'Confirmed', value: 28, color: 'bg-blue-500' },
                  { label: 'Delivering', value: 15, color: 'bg-purple-500' },
                  { label: 'Completed', value: 45, color: 'bg-success' },
                ]}
                height={300}
              />
            </ChartCard>
          </div>

          {/* My Stores & Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">My Stores</h2>
                  <p className="text-sm text-muted-foreground">Manage and view your storefronts.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/seller/stores">
                    <Button variant="outline">View Stores</Button>
                  </Link>
                  <Link href="/seller/settings">
                    <Button>Create Store</Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                {stores && stores.length > 0 ? (
                  stores.slice(0, 3).map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.city || s.address || '—'}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{s.productCount ?? '—'} products</div>
                    </div>
                  ))
                ) : (
                  getFakeStores().slice(0, 3).map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.city || s.address || '—'}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{s.productCount ?? '—'} products</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">My Products</h2>
                  <p className="text-sm text-muted-foreground">Quick access to your product listings.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/seller/products">
                    <Button variant="outline">View Products</Button>
                  </Link>
                  <Link href="/seller/products/new">
                    <Button>Create Product</Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                {previewProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded object-cover" />
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        <p className="text-sm text-muted-foreground">${p.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{p.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
              <Link href="/seller/orders">
                <Button variant="outline" className="gap-2">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link key={order.id} href={`/seller/orders/${order.id}`}>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Order #{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{order.customer?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${order.total}</p>
                        <StatusBadge status={order.status} size="sm" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No orders yet</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/seller/products/new">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                <Plus className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground">Add Product</h3>
                <p className="text-sm text-muted-foreground mt-1">Create a new product listing</p>
              </div>
            </Link>

            <Link href="/seller/orders">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-colors cursor-pointer">
                <ShoppingCart className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="font-semibold text-foreground">View Orders</h3>
                <p className="text-sm text-muted-foreground mt-1">Check pending orders</p>
              </div>
            </Link>

            <Link href="/seller/analytics">
              <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-6 border border-success/20 hover:border-success/40 transition-colors cursor-pointer">
                <TrendingUp className="w-8 h-8 text-success mb-3" />
                <h3 className="font-semibold text-foreground">Analytics</h3>
                <p className="text-sm text-muted-foreground mt-1">View detailed insights</p>
              </div>
            </Link>
          </div>
        </div>
      </SellerLayout>
    </ProtectedRoute>
  );
}

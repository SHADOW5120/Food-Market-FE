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
import { sellerApi } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';
import type { SellerDashboardStats } from '@/lib/types';
import { USER_ROLES } from '@/lib/constants';

export default function SellerDashboard() {
  const { user, role, hasHydrated } = useAuth();
  const isSeller = role === USER_ROLES.SELLER;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Dùng trực tiếp SellerDashboardStats từ file types
  const [stats, setStats] = useState<SellerDashboardStats>({
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
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [storeName, setStoreName] = useState('My Store');

  useEffect(() => {
    if (!hasHydrated || !isSeller) {
      return;
    }
    loadDashboardData();
  }, [hasHydrated, isSeller]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 30); // Mặc định lấy 30 ngày gần nhất

      // Gọi đồng thời các API để tối ưu tốc độ load
      const [statsRes, analyticsRes, ordersRes, orderStatusRes] = await Promise.all([
        sellerApi.getDashboardSummary(),
        sellerApi.getStoreRevenueChart({
          from: from.toISOString(),
          to: to.toISOString(),
          groupBy: 'day'
        }),
        sellerApi.getSellerOrders(1, 5),
        sellerApi.getOrderStatusPieChart()
      ]);

      // 1. Cập nhật Stats tổng quan
      const summaryData = statsRes && 'data' in statsRes ? statsRes.data : statsRes;
      if (summaryData) {
        setStats(prev => ({ ...prev, ...summaryData }));
        setStoreName(user?.username || 'My Store');
      }

      // 2. Cập nhật biểu đồ doanh thu (Revenue Trend)
      const revenueChartData: any[] = Array.isArray(analyticsRes) ? analyticsRes : (analyticsRes as any)?.data || [];
      setRevenueData(
        revenueChartData.map((item: any) => ({
          label: new Date(item.date || item.time || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: item.totalRevenue || item.revenue || 0,
        }))
      );

      // 3. Cập nhật biểu đồ trạng thái đơn hàng
      const statusDataList: any[] = Array.isArray(orderStatusRes) ? orderStatusRes : (orderStatusRes as any)?.data || [];
      const colors = ['bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-success', 'bg-destructive'];
      
      const mappedStatusData = statusDataList.map((st: any, index: number) => ({
        label: st.status || st.name || 'Unknown',
        value: st.count || st.value || 0,
        color: colors[index % colors.length]
      }));
      setOrderStatusData(mappedStatusData);

      // 4. Cập nhật danh sách đơn hàng gần đây
      const ordersList = (ordersRes as any)?.data?.items || (ordersRes as any)?.items || [];
      setRecentOrders(ordersList);

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
            <Link href="/seller/products/new">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingCart className="w-6 h-6 text-success" />}
              onClick={() => router.push('/seller/orders')}
            />
            <StatCard
              title="Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6 text-success" />}
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
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Revenue Trend (Last 30 Days)" isLoading={isLoading}>
              {revenueData.length > 0 ? (
                <SimpleLineChart data={revenueData} height={300} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </ChartCard>

            <ChartCard title="Order Status Distribution" isLoading={isLoading}>
              {orderStatusData.length > 0 ? (
                <SimpleBarChart data={orderStatusData} height={300} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </ChartCard>
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
                        <p className="font-medium text-foreground">Order #{order.orderNumber || order.id.substring(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">{order.customer?.name || order.customerName || 'Guest'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${order.totalAmount || order.total || 0}</p>
                        <StatusBadge status={order.status || 'pending'} size="sm" />
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
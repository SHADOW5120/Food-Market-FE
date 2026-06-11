'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, BarChart3, PieChart } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { ChartCard } from '@/components/seller/ChartCard';
import { SimpleBarChart, SimpleLineChart } from '@/components/seller/Charts';
import { StatCard } from '@/components/seller/StatCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { sellerApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { USER_ROLES } from '@/lib/constants';

type PeriodType = 'week' | 'month' | 'year';

export default function SellerAnalyticsPage() {
  const { user, role, hasHydrated } = useAuth();
  const isSeller = role === USER_ROLES.SELLER;
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodType>('month');
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    if (!hasHydrated || !isSeller) {
      return;
    }
    loadAnalytics();
  }, [period, hasHydrated, isSeller]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);

      // Load analytics data using correct API endpoint
      const analyticsRes = await sellerApi.getAnalytics(period);
      if (analyticsRes.success && analyticsRes.data) {
        const data = analyticsRes.data;
        setRevenueData(
          data.map((item) => ({
            label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: item.revenue,
          }))
        );

        // Calculate stats
        const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
        const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats({
          totalRevenue,
          totalOrders,
          averageOrderValue: Math.round(avgOrderValue * 100) / 100,
          conversionRate: 3.2, // Mock data
        });
      }

      // Mock top products data
      setTopProducts([
        { label: 'Burger Deluxe', value: 245, color: 'bg-primary' },
        { label: 'Pizza Supreme', value: 189, color: 'bg-success' },
        { label: 'Salad Fresh', value: 156, color: 'bg-blue-500' },
        { label: 'Pasta Carbonara', value: 143, color: 'bg-purple-500' },
      ]);
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
      <SellerLayout user={user} storeName="My Store">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">View your sales performance</p>
            </div>

            {/* Period Filter */}
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    period === p
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={<TrendingUp className="w-6 h-6 text-success" />}
              trend={{ value: 15, direction: 'up' }}
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<BarChart3 className="w-6 h-6 text-primary" />}
              trend={{ value: 8, direction: 'up' }}
            />
            <StatCard
              title="Average Order Value"
              value={`$${stats.averageOrderValue.toFixed(2)}`}
              icon={<PieChart className="w-6 h-6 text-blue-500" />}
            />
            <StatCard
              title="Conversion Rate"
              value={`${stats.conversionRate}%`}
              icon={<Calendar className="w-6 h-6 text-yellow-500" />}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title={`Revenue Trend (Last ${period})`} isLoading={isLoading}>
              {revenueData.length > 0 ? (
                <SimpleLineChart data={revenueData} height={300} />
              ) : (
                <div className="h-300 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </ChartCard>

            <ChartCard title="Top Selling Products" isLoading={isLoading}>
              <SimpleBarChart data={topProducts} height={300} />
            </ChartCard>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Customer Insights</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">Total Customers</span>
                  <span className="font-bold text-foreground">1,247</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">Repeat Customers</span>
                  <span className="font-bold text-foreground">342</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">New Customers</span>
                  <span className="font-bold text-foreground">905</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Order Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">Pending</span>
                  <span className="font-bold text-yellow-600">24</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">Completed</span>
                  <span className="font-bold text-success">1,189</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">Cancelled</span>
                  <span className="font-bold text-destructive">34</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SellerLayout>
    </ProtectedRoute>
  );
}

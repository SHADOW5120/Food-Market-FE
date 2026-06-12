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
  const [customersCount, setCustomersCount] = useState<number>(0);
  const [orderStatus, setOrderStatus] = useState({ pending: 0, completed: 0, cancelled: 0 });
  
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

  const getFilterDates = () => {
    const to = new Date();
    const from = new Date();
    let groupBy: 'day' | 'week' | 'month' | 'year' = 'day';

    if (period === 'week') {
      from.setDate(to.getDate() - 7);
    } else if (period === 'month') {
      from.setMonth(to.getMonth() - 1);
    } else if (period === 'year') {
      from.setFullYear(to.getFullYear() - 1);
      groupBy = 'month';
    }

    return { 
      from: from.toISOString(), 
      to: to.toISOString(), 
      groupBy 
    };
  };

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const { from, to, groupBy } = getFilterDates();

      // Gọi song song các API từ BE SellerController
      const [
        revenueRes, 
        statsRes, 
        topProductsRes, 
        customersRes, 
        orderStatusRes
      ] = await Promise.all([
        sellerApi.getStoreRevenueChart({ from, to, groupBy }),
        sellerApi.getDashboardStats(),
        sellerApi.getTopProducts(4),
        sellerApi.getCustomerCount(),
        sellerApi.getOrderStatusPieChart()
      ]);

      // Xử lý an toàn vì Backend có thể trả về data trực tiếp (Ok(result)) hoặc bọc trong ApiResponse { data: ... }
      const revenueChartData: any[] = Array.isArray(revenueRes) ? revenueRes : (revenueRes as any)?.data || [];
      const dashboardStats: any = statsRes && 'data' in statsRes ? (statsRes as any).data : statsRes;
      const topProductsData: any[] = Array.isArray(topProductsRes) ? topProductsRes : (topProductsRes as any)?.data || [];
      const customerCountData: number = typeof customersRes === 'number' ? customersRes : (customersRes as any)?.data || 0;
      const orderStatusDataList: any[] = Array.isArray(orderStatusRes) ? orderStatusRes : (orderStatusRes as any)?.data || [];

      // 1. Map Dữ liệu Biểu đồ Doanh thu (Time Series)
      setRevenueData(
        revenueChartData.map((item: any) => ({
          label: new Date(item.date || item.time || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: item.totalRevenue || item.revenue || 0,
        }))
      );

      // 2. Map Thông kê tổng quan (Summary Stats)
      setStats({
        totalRevenue: dashboardStats?.totalRevenue || 0,
        totalOrders: dashboardStats?.totalOrders || 0,
        averageOrderValue: dashboardStats?.totalOrders > 0 
          ? Math.round((dashboardStats.totalRevenue / dashboardStats.totalOrders) * 100) / 100 
          : 0,
        conversionRate: dashboardStats?.conversionRate || 0, // Fallback nếu BE chưa có field này
      });

      // 3. Map Top Sản Phẩm
      const colors = ['bg-primary', 'bg-success', 'bg-blue-500', 'bg-purple-500'];
      setTopProducts(
        topProductsData.map((item: any, index: number) => ({
          label: item.productName || item.name || `Sản phẩm ${index + 1}`,
          value: item.totalRevenue || item.revenue || item.totalSold || 0,
          color: colors[index % colors.length]
        }))
      );

      // 4. Map Insights Khách hàng
      setCustomersCount(customerCountData);

      // 5. Map Trạng thái Đơn hàng
      const statusMap = { pending: 0, completed: 0, cancelled: 0 };
      orderStatusDataList.forEach((st: any) => {
        const statusName = (st.status || st.name || '').toLowerCase();
        const count = st.count || st.value || 0;
        
        if (statusName.includes('pending') || statusName.includes('chờ')) statusMap.pending += count;
        if (statusName.includes('completed') || statusName.includes('hoàn thành') || statusName.includes('delivered')) statusMap.completed += count;
        if (statusName.includes('cancel') || statusName.includes('hủy')) statusMap.cancelled += count;
      });
      setOrderStatus(statusMap);

    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu phân tích (Analytics)');
      console.error('API Error:', error);
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
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<BarChart3 className="w-6 h-6 text-primary" />}
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
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </ChartCard>

            <ChartCard title="Top Selling Products" isLoading={isLoading}>
              {topProducts.length > 0 ? (
                <SimpleBarChart data={topProducts} height={300} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </ChartCard>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Customer Insights</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">Total Customers</span>
                  <span className="font-bold text-foreground">{customersCount.toLocaleString()}</span>
                </div>
                {/* Ẩn các mock data không có API hỗ trợ */}
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg opacity-50">
                  <span className="text-foreground">Repeat Customers (Demo)</span>
                  <span className="font-bold text-foreground">--</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg opacity-50">
                  <span className="text-foreground">New Customers (Demo)</span>
                  <span className="font-bold text-foreground">--</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Order Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">Pending</span>
                  <span className="font-bold text-yellow-600">{orderStatus.pending}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">Completed</span>
                  <span className="font-bold text-success">{orderStatus.completed}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-foreground">Cancelled</span>
                  <span className="font-bold text-destructive">{orderStatus.cancelled}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SellerLayout>
    </ProtectedRoute>
  );
}
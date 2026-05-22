'use client';

import { Bell, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/lib/constants';

const mockNotifications = [
  {
    id: '1',
    title: 'New order received',
    description: 'Order #2034 has been placed and is ready for review.',
    time: '2 hours ago',
  },
  {
    id: '2',
    title: 'Product low stock',
    description: 'One of your best selling items is low on stock.',
    time: '5 hours ago',
  },
  {
    id: '3',
    title: 'Store update available',
    description: 'Review the latest seller dashboard improvements.',
    time: '1 day ago',
  },
];

export default function SellerNotificationsPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
      <SellerLayout user={user} storeName="My Store">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground">Your latest seller alerts and reminders.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              <Bell className="w-4 h-4 text-primary" />
              <span>3 new alerts</span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 text-primary">
                <Sparkles className="w-5 h-5" />
                <h2 className="font-semibold text-foreground">Quick Overview</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Handle your most important notifications without leaving the dashboard.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-3xl font-bold text-foreground">3</p>
              <p className="mt-2 text-sm text-muted-foreground">Total alerts</p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-3xl font-bold text-success">2</p>
              <p className="mt-2 text-sm text-muted-foreground">Unread items</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Recent notifications</h2>
                <p className="text-sm text-muted-foreground">Stay on top of your store activity.</p>
              </div>
            </div>

            <div className="space-y-4">
              {mockNotifications.map((notification) => (
                <div key={notification.id} className="rounded-3xl border border-border bg-background p-4 transition hover:border-primary/50 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SellerLayout>
    </ProtectedRoute>
  );
}

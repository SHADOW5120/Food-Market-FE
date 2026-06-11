'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { sellerApi } from '@/lib/api';
import { Store } from '@/lib/types';
import { MapPin, Plus, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/shadcn/button';
import { USER_ROLES } from '@/lib/constants';

export default function SellerStoresPage() {
  const { user, role, hasHydrated } = useAuth();
  const isSeller = role === USER_ROLES.SELLER;
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStores() {
      try {
        setLoading(true);
        const response = await sellerApi.getSellerStore();
        if (response.success && Array.isArray(response.data)) {
          setStores(response.data);
        } else {
          toast.error('Unable to load your stores.');
        }
      } catch (error) {
        console.error('Store load error:', error);
        toast.error('Unable to load your stores.');
      } finally {
        setLoading(false);
      }
    }

    if (!hasHydrated || !isSeller) {
      return;
    }
    loadStores();
  }, [hasHydrated, isSeller]);

  return (
    <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
      <SellerLayout user={user} storeName="My Store">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Store Management</h1>
              <p className="text-muted-foreground">Organize and maintain your store locations.</p>
            </div>
              <Link
                href="/seller/settings"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-muted/70"
              >
                <Settings className="w-4 h-4" />
                Store Settings
              </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 text-primary">
                <MapPin className="w-5 h-5" />
                <h2 className="font-semibold text-foreground">My storefronts</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Manage your active locations, addresses, and operating hours from one place.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 text-success">
                <Plus className="w-5 h-5" />
                <h2 className="font-semibold text-foreground">New location</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Add a new store to expand your customer reach and manage inventory separately.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Your stores</h2>
                <p className="text-sm text-muted-foreground">Quick overview of your current locations.</p>
              </div>
                <Button asChild variant="secondary">
                <Link href="/seller/settings">
                    Manage settings
                </Link>
                </Button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-24 rounded-3xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : stores.length > 0 ? (
              <div className="space-y-4">
                {stores.map((store) => (
                  <div key={store.id} className="rounded-3xl border border-border bg-background p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-foreground">{store.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{store.address || 'Address not set'}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {store.productCount !== undefined ? `${store.productCount} products` : 'Products not available'}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:items-end">
                        <div className="flex gap-2 flex-wrap">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary font-semibold">
                            {store.city ?? 'No city'}
                          </span>
                          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                            {store.state ?? 'Unknown'}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Link
                            href={`/seller/settings?storeId=${store.id}`}
                            className="rounded-full border border-border px-3 py-1 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-muted/70"
                          >
                            Manage
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-muted p-8 text-center">
                <p className="text-sm text-muted-foreground">No stores available yet.</p>
                <p className="mt-2 text-sm text-foreground">Create your first storefront in store settings.</p>
              </div>
            )}
          </div>
        </div>
      </SellerLayout>
    </ProtectedRoute>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useStoreStore } from '@/store/store';
import { useCartStore } from '@/store/cart';
import StoreHeader from '@/components/store/StoreHeader';
import CategoryTabs from '@/components/store/CategoryTabs';
import StoreMenu from '@/components/store/StoreMenu';
import CartBadge from '@/components/cart/CartBadge';

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params.id as string;

  const { currentStore, products, categories, loading, error, fetchStoreById, fetchStoreProducts } = useStoreStore();
  const { getTotalItems } = useCartStore();

  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    if (storeId) {
      fetchStoreById(storeId);
      fetchStoreProducts(storeId);
    }
  }, [storeId, fetchStoreById, fetchStoreProducts]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Loading skeleton for store header */}
        <div className="relative h-64 bg-muted animate-pulse">
          <div className="absolute bottom-4 left-4 right-4 flex items-end">
            <div className="w-20 h-20 bg-muted rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Loading skeleton for categories */}
        <div className="sticky top-0 bg-card border-b z-10">
          <div className="flex space-x-4 p-4 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded-full px-4 py-2 min-w-max animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Loading skeleton for products */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl shadow-sm p-4 animate-pulse">
                <div className="w-full h-32 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error || 'Store not found'}
          </p>
          <a
            href="/stores"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary"
          >
            Back to Stores
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <StoreHeader store={currentStore} />

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <StoreMenu
        products={products}
        categories={categories}
        activeCategory={activeCategory}
      />

      {/* Sticky Cart Badge */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <CartBadge />
        </div>
      )}
    </div>
  );
}
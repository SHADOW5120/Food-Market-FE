'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useStoreStore } from '@/store/store';
import StoreCard from '@/components/store/StoreCard';
import StoreList from '@/components/store/StoreList';

export default function StoresPage() {
  const { stores, loading, error, fetchStores } = useStoreStore();

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Stores</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl shadow-sm p-4 animate-pulse">
              <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Stores</h1>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load stores: {error}</p>
          <button
            onClick={fetchStores}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Stores</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No stores available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Stores</h1>
      <StoreList stores={stores} />
    </div>
  );
}


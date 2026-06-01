'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SearchBar } from '@/components/filter/SearchBar';
import { CategoryFilter } from '@/components/filter/CategoryFilter';
import { PriceFilter } from '@/components/filter/PriceFilter';
import { SortOptions } from '@/components/filter/SortOptions';
import { getProducts, getCategories } from '@/lib/api';
import { Product, Category, ProductFilters } from '@/lib/types';

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Parse filters from URL
  const filters: ProductFilters = {
    categoryId: searchParams.get('categoryId') || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    search: searchParams.get('search') || undefined,
  };

  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load products
        const productsResponse = await getProducts(filters, page, 12);
        if (productsResponse) {
          setProducts(productsResponse.items);
          setTotalPages(productsResponse.pageSize ? Math.ceil(productsResponse.total / productsResponse.pageSize) : 1);
          setCurrentPage(productsResponse.page);
          setTotalProducts(productsResponse.total);
        }

        // Load categories
        const categoriesResponse = await getCategories();
        if (Array.isArray(categoriesResponse)) {
          setCategories(categoriesResponse);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    window.history.pushState(null, '', `/products?${params.toString()}`);
    window.location.reload(); // Simple reload for now
  };

  const { isAuthenticated, hasHydrated } = useAuth();

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Our Menu</h1>
          <p className="text-muted-foreground">Discover delicious dishes from our curated collection</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-12 bg-muted rounded-lg animate-pulse max-w-md"></div>}>
            <SearchBar className="max-w-md" />
          </Suspense>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-foreground mb-6">Filters</h2>

              <div className="space-y-6">
                <CategoryFilter categories={categories} loading={loading} />
                <PriceFilter minPrice={0} maxPrice={100} />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort and Results Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  'Loading...'
                ) : (
                  `Showing ${products.length} of ${totalProducts} products`
                )}
              </div>
              <SortOptions />
            </div>

            {/* Products Grid */}
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          pageNum === currentPage
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground bg-card border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] hover:bg-muted'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }).filter(Boolean)}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


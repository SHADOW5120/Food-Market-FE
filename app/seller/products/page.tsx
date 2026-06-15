'use client';

import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { ProductRow } from '@/components/seller/ProductRow';
import { Button } from '@/components/auth/Button';
import { sellerApi, shouldRunOnce } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { user, role, hasHydrated, isAuthenticated } = useAuth();
  const isSeller = role === USER_ROLES.SELLER;
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'unavailable'>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const status = filterStatus === 'all' ? undefined : filterStatus;
        if (!selectedStoreId) {
          setProducts([]);
          setTotalPages(1);
          return;
        }

        const response = await sellerApi.getSellerProducts(selectedStoreId, currentPage, 10, status);

        if (response.success && response.data) {
          setProducts(response.data.items);
          setTotalPages(response.data.totalPages);
        } else {
          toast.error('Failed to load products');
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    if (!hasHydrated || !isSeller || !isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    const key = `products:${user.id}:store:${selectedStoreId}:page:${currentPage}:status:${filterStatus}`;
    if (!shouldRunOnce(key)) return;

    fetchProducts();
  }, [user, filterStatus, currentPage, hasHydrated, isSeller, selectedStoreId]);

  // Load seller stores for selection
  useEffect(() => {
    const loadStores = async () => {
      try {
        if (!user) return;
        const res = await sellerApi.getSellerStores(user.id);
        if (res.success && Array.isArray(res.data)) {
          setStores(res.data);
          if (res.data.length === 1) setSelectedStoreId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load stores', err);
      }
    };

    if (hasHydrated && isSeller && user) loadStores();
  }, [user, hasHydrated, isSeller]);

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddProduct = () => {
    router.push('/seller/products/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/seller/products/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const product = products.find(p => p.id === id);
      const response = await sellerApi.deleteSellerProduct(id, product?.storeId || selectedStoreId);
      if (response.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleToggle = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newStatus = product.status === 'available' ? 'unavailable' : 'available';
    
    try {
      const response = await sellerApi.updateSellerProduct(id, { status: newStatus, storeId: product.storeId || selectedStoreId });
      if (response.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: newStatus } : p
          )
        );
        toast.success('Product status updated');
      } else {
        toast.error('Failed to update product status');
      }
    } catch (error) {
      console.error('Failed to update product status:', error);
      toast.error('Failed to update product status');
    }
  };

  return (
    <ProtectedRoute requiredRoles={[USER_ROLES.SELLER]}>
      <SellerLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">Manage your menu items</p>
          </div>
          <div className="flex items-center gap-4">
            {stores.length > 0 && (
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-input text-foreground"
              >
                <option value="">Select store</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}
            <Button onClick={handleAddProduct} variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg shadow p-4 border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-[color:hsl(var(--border))] rounded-lg focus:outline-none focus:border-success"
            />

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border-2 border-[color:hsl(var(--border))] rounded-lg focus:outline-none focus:border-success"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Table */}
        {!selectedStoreId && stores.length > 0 ? (
          <div className="bg-card rounded-lg shadow p-8 text-center border border-border">
            <p className="text-muted-foreground mb-4">Please select a store to view its products.</p>
            <Button onClick={() => {}} variant="outline">Select Store</Button>
          </div>
        ) : loading ? (
          <div className="bg-card rounded-lg shadow border border-border p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Store
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggle={handleToggle}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow p-12 text-center border border-border">
            <p className="text-muted-foreground text-lg mb-4">No products found</p>
            <Button onClick={handleAddProduct} variant="primary">
              Add your first product
            </Button>
          </div>
        )}
      </div>
    </SellerLayout>
  </ProtectedRoute>
  );
}



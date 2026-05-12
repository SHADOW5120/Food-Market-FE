'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { ProductRow } from '@/components/seller/ProductRow';
import { Button } from '@/components/auth/Button';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  status: 'available' | 'unavailable';
  category: string;
}

export default function ProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'unavailable'>('all');

  // Mock data - replace with API call
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Margherita Pizza',
      price: 12.99,
      image: undefined,
      status: 'available',
      category: 'Pizza',
    },
    {
      id: '2',
      name: 'Caesar Salad',
      price: 8.99,
      image: undefined,
      status: 'available',
      category: 'Salad',
    },
    {
      id: '3',
      name: 'Burger Combo',
      price: 15.99,
      image: undefined,
      status: 'unavailable',
      category: 'Burgers',
    },
  ]);

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((p) => filterStatus === 'all' || p.status === filterStatus);

  const handleAddProduct = () => {
    router.push('/seller/products/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/seller/products/${id}`);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggle = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'available' ? 'unavailable' : 'available' }
          : p
      )
    );
  };

  if (!user) {
    return (
      <SellerLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Please log in as a seller</p>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">Manage your menu items</p>
          </div>
          <Button onClick={handleAddProduct} variant="primary">
            âž• Add Product
          </Button>
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
        {filteredProducts.length > 0 ? (
          <div className="bg-card rounded-lg shadow border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-[color:hsl(var(--border))]">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Product
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
          <div className="bg-card rounded-lg shadow p-12 text-center border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))]">
            <p className="text-muted-foreground text-lg mb-4">No products found</p>
            <Button onClick={handleAddProduct} variant="primary">
              Add your first product
            </Button>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}



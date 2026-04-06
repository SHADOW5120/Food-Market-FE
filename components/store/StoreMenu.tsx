import type { Product, Category } from '@/lib/types';
import ProductCard from './ProductCard';

interface StoreMenuProps {
  products: Product[];
  categories: Category[];
  activeCategory: string;
}

export default function StoreMenu({ products, categories, activeCategory }: StoreMenuProps) {
  // Group products by category
  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = products.filter(product => product.categoryId === category.id);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="container mx-auto px-4 py-6">
      {categories.map((category) => {
        const categoryProducts = productsByCategory[category.id] || [];

        if (categoryProducts.length === 0) return null;

        return (
          <div
            key={category.id}
            id={`category-${category.id}`}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-4">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
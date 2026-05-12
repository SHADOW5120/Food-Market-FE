'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/types';

interface CategoryFilterProps {
  categories: Category[];
  loading?: boolean;
}

export function CategoryFilter({ categories, loading = false }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    const category = searchParams.get('category') || '';
    setSelectedCategory(category);
  }, [searchParams]);

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    params.delete('page'); // Reset to first page on filter change

    router.push(`/products?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground mb-3">Categories</h3>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-8 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-foreground mb-3">Categories</h3>
      <div className="space-y-1">
        <button
          onClick={() => handleCategoryChange('')}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
            selectedCategory === ''
              ? 'bg-muted text-primary font-medium'
              : 'text-foreground hover:bg-muted'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-muted text-primary font-medium'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
}

export function PriceFilter({ minPrice = 0, maxPrice = 100 }: PriceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : minPrice,
    max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : maxPrice,
  });

  useEffect(() => {
    const min = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : minPrice;
    const max = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : maxPrice;
    setPriceRange({ min, max });
  }, [searchParams, minPrice, maxPrice]);

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);

    const params = new URLSearchParams(searchParams.toString());
    if (newRange.min > minPrice) {
      params.set('minPrice', newRange.min.toString());
    } else {
      params.delete('minPrice');
    }
    if (newRange.max < maxPrice) {
      params.set('maxPrice', newRange.max.toString());
    } else {
      params.delete('maxPrice');
    }
    params.delete('page'); // Reset to first page on filter change

    router.push(`/products?${params.toString()}`);
  };

  const handleClear = () => {
    setPriceRange({ min: minPrice, max: maxPrice });
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const hasActiveFilters = priceRange.min > minPrice || priceRange.max < maxPrice;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Price Range</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-sm text-primary hover:text-primary font-medium"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Min Price: ${priceRange.min}</label>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange.min}
            onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">Max Price: ${priceRange.max}</label>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange.max}
            onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
        ${priceRange.min} - ${priceRange.max}
      </div>
    </div>
  );
}


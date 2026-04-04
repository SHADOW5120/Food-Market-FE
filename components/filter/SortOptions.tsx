'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type SortOption = 'price_asc' | 'price_desc' | 'popularity' | 'newest';

interface SortOptionsProps {
  className?: string;
}

const sortOptions = [
  { value: 'popularity' as SortOption, label: 'Most Popular' },
  { value: 'newest' as SortOption, label: 'Newest First' },
  { value: 'price_asc' as SortOption, label: 'Price: Low to High' },
  { value: 'price_desc' as SortOption, label: 'Price: High to Low' },
];

export function SortOptions({ className = "" }: SortOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSort, setSelectedSort] = useState<SortOption>(
    (searchParams.get('sortBy') as SortOption) || 'popularity'
  );

  useEffect(() => {
    const sortBy = searchParams.get('sortBy') as SortOption;
    if (sortBy && sortOptions.find(option => option.value === sortBy)) {
      setSelectedSort(sortBy);
    } else {
      setSelectedSort('popularity');
    }
  }, [searchParams]);

  const handleSortChange = (sortBy: SortOption) => {
    setSelectedSort(sortBy);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortBy);
    params.delete('page'); // Reset to first page on sort change

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 font-medium">Sort by:</span>
      <select
        value={selectedSort}
        onChange={(e) => handleSortChange(e.target.value as SortOption)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
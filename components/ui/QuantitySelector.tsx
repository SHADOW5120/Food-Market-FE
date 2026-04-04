'use client';

import { useState } from 'react';

interface QuantitySelectorProps {
  initialQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onChange?: (quantity: number) => void;
  className?: string;
}

export function QuantitySelector({
  initialQuantity = 1,
  minQuantity = 1,
  maxQuantity = 99,
  onChange,
  className = '',
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > minQuantity) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || minQuantity;
    const clampedValue = Math.max(minQuantity, Math.min(maxQuantity, value));
    setQuantity(clampedValue);
    onChange?.(clampedValue);
  };

  return (
    <div className={`flex items-center border border-gray-300 rounded-lg ${className}`}>
      <button
        onClick={handleDecrement}
        disabled={quantity <= minQuantity}
        className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleChange}
        min={minQuantity}
        max={maxQuantity}
        className="w-16 text-center border-0 focus:ring-0 bg-transparent font-medium"
        aria-label="Quantity"
      />

      <button
        onClick={handleIncrement}
        disabled={quantity >= maxQuantity}
        className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
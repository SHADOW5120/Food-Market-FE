'use client';

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export function OrderSummary({ subtotal, deliveryFee, tax, total }: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      {/* Subtotal */}
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
      </div>

      {/* Delivery Fee */}
      {deliveryFee > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-semibold text-gray-900">${deliveryFee.toFixed(2)}</span>
        </div>
      )}

      {/* Tax */}
      {tax > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 pt-3" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-orange-600">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

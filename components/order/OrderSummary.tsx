'use client';

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export function OrderSummary({ subtotal, deliveryFee, tax, total }: OrderSummaryProps) {
  return (
    <div className="bg-muted rounded-lg p-4 space-y-3">
      {/* Subtotal */}
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
      </div>

      {/* Delivery Fee */}
      {deliveryFee > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-semibold text-foreground">${deliveryFee.toFixed(2)}</span>
        </div>
      )}

      {/* Tax */}
      {tax > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span className="font-semibold text-foreground">${tax.toFixed(2)}</span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] pt-3" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-foreground">Total</span>
        <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}


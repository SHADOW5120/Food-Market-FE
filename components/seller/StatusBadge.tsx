'use client';

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled' | 'available' | 'unavailable';
  className?: string;
}

const statusConfig = {
  pending: { bg: 'bg-warning/20', text: 'text-warning', label: 'Pending' },
  confirmed: { bg: 'bg-secondary/20', text: 'text-secondary-foreground', label: 'Confirmed' },
  delivering: { bg: 'bg-accent/20', text: 'text-accent', label: 'Delivering' },
  completed: { bg: 'bg-success', text: 'text-success', label: 'Completed' },
  cancelled: { bg: 'bg-destructive', text: 'text-destructive', label: 'Cancelled' },
  available: { bg: 'bg-success', text: 'text-success', label: 'Available' },
  unavailable: { bg: 'bg-muted', text: 'text-foreground', label: 'Unavailable' },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text} ${className}`}>
      {config.label}
    </span>
  );
}




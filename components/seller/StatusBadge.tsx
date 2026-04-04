'use client';

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled' | 'available' | 'unavailable';
  className?: string;
}

const statusConfig = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
  delivering: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Delivering' },
  completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
  available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Available' },
  unavailable: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unavailable' },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text} ${className}`}>
      {config.label}
    </span>
  );
}

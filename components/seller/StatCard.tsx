'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: { value: number; direction: 'up' | 'down' };
  onClick?: () => void;
}

export function StatCard({ title, value, icon, trend, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow p-6 border border-gray-200 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-green-300 transition-all' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="mt-2 text-xs font-semibold">
              <span
                className={
                  trend.direction === 'up'
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 ml-1">this month</span>
            </div>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

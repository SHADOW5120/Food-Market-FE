'use client';

import { RatingBreakdown as RatingBreakdownType } from '@/lib/types';

interface RatingBreakdownProps {
  breakdown: RatingBreakdownType;
  totalReviews: number;
  className?: string;
}

export function RatingBreakdown({ breakdown, totalReviews, className = '' }: RatingBreakdownProps) {
  const maxCount = Math.max(...Object.values(breakdown));

  return (
    <div className={`space-y-2 ${className}`}>
      {([5, 4, 3, 2, 1] as const).map((stars) => {
        const count = breakdown[stars];
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

        return (
          <div key={stars} className="flex items-center gap-3">
            <div className="flex items-center gap-1 min-w-[60px]">
              <span className="text-sm font-medium text-gray-700">{stars}</span>
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <span className="text-sm text-gray-600 min-w-[40px] text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
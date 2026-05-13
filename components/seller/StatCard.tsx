'use client';

import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; direction: 'up' | 'down' };
  onClick?: () => void;
}

export function StatCard({ title, value, icon, trend, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-lg shadow p-6 border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-success transition-all' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className="mt-2 text-xs font-semibold">
              <span
                className={
                  trend.direction === 'up'
                    ? 'text-success'
                    : 'text-destructive'
                }
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground ml-1">this month</span>
            </div>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}





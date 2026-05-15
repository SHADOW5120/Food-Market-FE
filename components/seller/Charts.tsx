'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SimpleChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: SimpleChartData[];
  height?: number;
}

export function SimpleBarChart({ data, height = 300 }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-around gap-4 h-full">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 100}%` }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <div
              className={`w-full rounded-t-lg ${item.color || 'bg-primary'} hover:opacity-80 transition-opacity`}
              title={`${item.label}: ${item.value}`}
            />
            <span className="text-xs font-medium text-muted-foreground text-center truncate">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface SimpleLineChartProps {
  data: SimpleChartData[];
  height?: number;
}

export function SimpleLineChart({ data, height = 300 }: SimpleLineChartProps) {
  const [svgPath, setSvgPath] = useState('');
  const [points, setPoints] = useState('');

  useEffect(() => {
    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const width = 800;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const pointsArray = data.map((item, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
      const y = height - padding - (item.value / maxValue) * chartHeight;
      return { x, y };
    });

    const pathD = pointsArray.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    setSvgPath(pathD);

    const pointsStr = pointsArray.map((p) => `${p.x},${p.y}`).join(' ');
    setPoints(pointsStr);
  }, [data, height]);

  return (
    <svg width="100%" height={height} className="bg-transparent">
      <polyline
        points={points}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {data.map((item, index) => {
        const maxValue = Math.max(...data.map((d) => d.value), 1);
        const width = 800;
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
        const y = height - padding - (item.value / maxValue) * chartHeight;
        return (
          <g key={`point-${index}`}>
            <circle
              cx={x}
              cy={y}
              r="4"
              fill="hsl(var(--primary))"
              stroke="white"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <title>{`${item.label}: ${item.value}`}</title>
          </g>
        );
      })}
    </svg>
  );
}

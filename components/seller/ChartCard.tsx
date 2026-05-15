'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function ChartCard({ title, children, isLoading = false }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl shadow-sm border border-border p-6"
    >
      <h3 className="text-lg font-bold text-foreground mb-4">{title}</h3>
      {isLoading ? (
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      ) : (
        <div>{children}</div>
      )}
    </motion.div>
  );
}

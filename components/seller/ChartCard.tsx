'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/components/ui/motion';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function ChartCard({ title, children, isLoading = false }: ChartCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
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

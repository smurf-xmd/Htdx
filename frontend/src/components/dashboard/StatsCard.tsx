'use client';

import React from 'react';
import Card from '@/components/common/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, trend }) => {
  return (
    <Card className="hover:from-surface/60 hover:to-surface/40 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white/60 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtitle && <p className="text-white/50 text-xs mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-3xl opacity-50">{icon}</div>}
      </div>
      {trend && (
        <div className={`mt-4 text-xs font-medium ${trend.direction === 'up' ? 'text-success' : 'text-error'}`}>
          {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
        </div>
      )}
    </Card>
  );
};

export default StatsCard;

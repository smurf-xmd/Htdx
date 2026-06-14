'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`rounded-lg bg-gradient-to-br from-surface/40 to-surface/20 border border-white/10 backdrop-blur-xl p-6 ${className || ''}`}>
      {children}
    </div>
  );
};

export default Card;

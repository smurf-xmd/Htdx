'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import Button from '@/components/common/Button';

const DashboardHeader: React.FC = () => {
  const router = useRouter();
  const { user, clearAuth } = useAuth();
  const { success } = useNotification();

  const handleLogout = () => {
    clearAuth();
    success('Logged out successfully');
    router.push('/login');
  };

  return (
    <header className="bg-gradient-to-r from-surface/40 to-surface/20 border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-white hover:text-primary-light transition-colors">
          HTD-X
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right">
              <p className="text-white font-medium text-sm">{user.username}</p>
              <p className="text-white/50 text-xs">{user.role}</p>
            </div>
          )}
          <Button onClick={handleLogout} variant="ghost" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

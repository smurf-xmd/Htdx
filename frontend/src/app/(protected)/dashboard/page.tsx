'use client';

import React from 'react';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import Card from '@/components/common/Card';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedLayout>
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-white/60">Manage and monitor your WhatsApp bots</p>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Bots" value="0" icon="🤖" trend={{ value: 0, direction: 'up' }} />
          <StatsCard title="Running" value="0" icon="🟢" />
          <StatsCard title="Stopped" value="0" icon="⏹️" />
          <StatsCard title="Plan" value={user?.subscriptionPlan || 'FREE'} icon="📋" />
        </div>

        {/* System metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">System Resources</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/60 text-sm">CPU Usage</span>
                  <span className="text-white font-medium">0%</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/60 text-sm">Memory Usage</span>
                  <span className="text-white font-medium">0 MB</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/60 text-sm">Disk Space</span>
                  <span className="text-white font-medium">0 GB</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors">
                📤 Upload Bot
              </button>
              <button className="w-full px-4 py-3 rounded-lg bg-surface hover:bg-surface-light text-white font-medium transition-colors border border-white/10">
                📊 View Logs
              </button>
              <button className="w-full px-4 py-3 rounded-lg bg-surface hover:bg-surface-light text-white font-medium transition-colors border border-white/10">
                ⚙️ Settings
              </button>
            </div>
          </Card>
        </div>

        {/* Recent activity */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="text-center py-12">
            <p className="text-white/60">No recent activity yet</p>
          </div>
        </Card>
      </main>
    </ProtectedLayout>
  );
}

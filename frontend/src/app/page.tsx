'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex flex-col items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10"></div>

      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-gradient">
          Host TalkDrive Pro
        </h1>
        <p className="text-xl text-white/70 mb-8 leading-relaxed">
          Deploy and manage WhatsApp bots directly on your Linux VPS without complex setups. Simple, powerful, and fully in your control.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-12">
          <Link href="/login">
            <Button size="lg" variant="primary">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: '🚀', title: 'Deploy Instantly', desc: 'Upload ZIP files and deploy bots in seconds' },
            { icon: '📊', title: 'Monitor Live', desc: 'Real-time logs, resource monitoring, and analytics' },
            { icon: '🔒', title: 'Secure & Private', desc: 'End-to-end encrypted, runs on your infrastructure' },
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-lg glass-dark hover:from-surface/60 hover:to-surface/40 transition-all">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

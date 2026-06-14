'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import Button from '@/components/common/Button';
import { authService } from '@/services/auth.service';
import { useNotification } from '@/hooks/useNotification';
import { isApiError } from '@/utils/api.utils';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success, error: notifyError } = useNotification();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token && !isVerified) {
      verifyEmail(token);
    }
  }, [searchParams, isVerified]);

  const verifyEmail = async (token: string) => {
    setIsVerifying(true);
    try {
      await authService.verifyEmail({ token });
      setIsVerified(true);
      success('Email verified successfully!');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Verification failed';
      setError(message);
      notifyError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AuthLayout title="Verify Your Email" subtitle="We've sent you a verification link">
      <div className="text-center space-y-6">
        {isVerifying && (
          <div className="py-8">
            <div className="animate-spin inline-block">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"></div>
            </div>
            <p className="text-white/60 mt-4">Verifying your email...</p>
          </div>
        )}

        {isVerified && (
          <div className="py-8">
            <div className="text-5xl mb-4">✓</div>
            <p className="text-white mb-4">Email verified successfully!</p>
            <p className="text-white/60 text-sm">Redirecting to dashboard...</p>
          </div>
        )}

        {error && !isVerifying && (
          <div className="py-8">
            <div className="text-5xl mb-4">✕</div>
            <p className="text-error mb-4">{error}</p>
            <Button onClick={() => router.push('/login')} variant="primary" className="w-full">
              Back to Login
            </Button>
          </div>
        )}

        {!isVerifying && !isVerified && !error && (
          <div className="py-8">
            <p className="text-white/60 mb-4">Click the link in your email to verify your account</p>
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

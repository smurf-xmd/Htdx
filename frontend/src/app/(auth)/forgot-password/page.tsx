'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { authService } from '@/services/auth.service';
import { useNotification } from '@/hooks/useNotification';
import { ValidatorsUtil } from '@/utils/validators.utils';
import { isApiError } from '@/utils/api.utils';

export default function ForgotPasswordPage() {
  const { success, error: notifyError } = useNotification();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!ValidatorsUtil.isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.forgotPassword({ email });
      setIsSubmitted(true);
      success('Password reset link sent to your email');
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Request failed';
      setError(message);
      notifyError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            error={error}
            disabled={isSubmitting}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
            Send Reset Link
          </Button>

          <div className="text-center pt-4 border-t border-white/10">
            <Link href="/login" className="text-white/60 hover:text-white transition-colors text-sm">
              Back to login
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="text-5xl mb-4">✓</div>
          <p className="text-white">Check your email for a password reset link</p>
          <p className="text-white/60 text-sm">If you don't see it, check your spam folder</p>
          <Link href="/login">
            <Button variant="secondary" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}

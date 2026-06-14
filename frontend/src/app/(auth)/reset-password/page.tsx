'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { authService } from '@/services/auth.service';
import { useNotification } from '@/hooks/useNotification';
import { ValidatorsUtil } from '@/utils/validators.utils';
import { isApiError } from '@/utils/api.utils';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success, error: notifyError } = useNotification();
  const token = searchParams.get('token') || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'password') {
      const errors = ValidatorsUtil.getPasswordStrengthErrors(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordErrors.length > 0) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setIsReset(true);
      success('Password reset successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Reset failed';
      notifyError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="The password reset link is invalid or expired">
        <div className="text-center py-8">
          <p className="text-error mb-4">Invalid reset link</p>
          <Button href="/forgot-password" variant="primary" className="w-full">
            Request New Link
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (isReset) {
    return (
      <AuthLayout title="Success" subtitle="Your password has been reset">
        <div className="text-center py-8 space-y-4">
          <div className="text-5xl">✓</div>
          <p className="text-white">Password reset successfully!</p>
          <p className="text-white/60 text-sm">Redirecting to login...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Create a new password for your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="New Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            disabled={isSubmitting}
          />
          {passwordErrors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {passwordErrors.map((err, idx) => (
                <li key={idx} className="text-xs text-warning">
                  • {err}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.confirmPassword}
          disabled={isSubmitting}
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}

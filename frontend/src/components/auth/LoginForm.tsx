'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import { authService } from '@/services/auth.service';
import { ValidatorsUtil } from '@/utils/validators.utils';
import { handleApiError, isApiError } from '@/utils/api.utils';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { setAuth, setIsLoading, setError } = useAuth();
  const { error: notifyError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!ValidatorsUtil.isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      setAuth(response);
      router.push('/dashboard');
    } catch (error) {
      const message = isApiError(error) ? error.message : 'Login failed';
      notifyError(message);
      setError(message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your@email.com"
        error={errors.email}
        disabled={isSubmitting}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        error={errors.password}
        disabled={isSubmitting}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Sign In
      </Button>

      <div className="pt-4 border-t border-white/10">
        <p className="text-center text-sm text-white/60 mb-3">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:text-primary-light transition-colors">
            Sign up
          </Link>
        </p>
        <p className="text-center text-sm">
          <Link href="/forgot-password" className="text-white/60 hover:text-white transition-colors">
            Forgot password?
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;

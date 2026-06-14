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

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { setAuth, setIsLoading } = useAuth();
  const { error: notifyError, success } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrengthErrors, setPasswordStrengthErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'password') {
      const errors = ValidatorsUtil.getPasswordStrengthErrors(value);
      setPasswordStrengthErrors(errors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!ValidatorsUtil.isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!ValidatorsUtil.isValidUsername(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters (alphanumeric and underscore)';
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrengthErrors.length > 0) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await authService.register(formData);
      setAuth(response);
      success('Registration successful! Please verify your email.');
      setTimeout(() => router.push('/verify-email'), 1500);
    } catch (error) {
      const message = isApiError(error) ? error.message : 'Registration failed';
      notifyError(message);
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
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="username"
        error={errors.username}
        helperText="3-20 characters, alphanumeric and underscore only"
        disabled={isSubmitting}
      />

      <Input
        label="Full Name"
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Your full name"
        error={errors.fullName}
        disabled={isSubmitting}
      />

      <div>
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
        {passwordStrengthErrors.length > 0 && (
          <ul className="mt-2 space-y-1">
            {passwordStrengthErrors.map((err, idx) => (
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

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Create Account
      </Button>

      <div className="pt-4 border-t border-white/10">
        <p className="text-center text-sm text-white/60">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;

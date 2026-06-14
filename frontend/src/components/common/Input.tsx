'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((
  { label, error, helperText, className, ...props },
  ref
) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-lg bg-surface/50 border border-white/10 text-white placeholder-white/40 transition-all duration-200 focus:outline-none focus:bg-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/30 ${
          error ? 'border-error/50 focus:border-error' : ''
        } ${className || ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-white/50">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

'use client';

import { useState } from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  icon?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  onBlur?: () => void;
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  icon,
  showToggle,
  onToggle,
  required = false,
  disabled = false,
  autoComplete,
  onBlur,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword(!showPassword);
    onToggle?.();
  };

  return (
    <div className="space-y-3">
      <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] block ml-6">
        {label}
        {required && <span className="text-accent-orange ml-1">*</span>}
      </label>
      <div className="relative group">
        {icon && (
          <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-orange transition-colors">
            {icon}
          </span>
        )}
        <input
          type={showPassword && type === 'password' ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          onBlur={onBlur}
          className={`w-full bg-surface-dim border focus:bg-white rounded-full h-[64px] text-text-dark transition-all duration-200 placeholder:text-text-muted/40 font-bold ${
            icon ? 'pl-14' : 'pl-8'
          } ${showToggle ? 'pr-14' : 'pr-8'} ${
            error
              ? 'border-red-500 focus:ring-4 focus:ring-red-500/10'
              : 'border-border/40 focus:ring-4 focus:ring-accent-orange/5 focus:border-accent-orange hover:border-accent-orange/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} shadow-inner-sm text-[16px]`}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        {showToggle && type === 'password' && (
          <button
            type="button"
            onClick={handleToggle}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent-orange transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
        {!error && value && type !== 'password' && (
          <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-accent-green text-[20px] font-bold">
            check_circle
          </span>
        )}
      </div>
      {error && (
        <p
          className="text-[11px] font-black text-red-500 ml-6 mt-2 uppercase tracking-widest"
          id={`${label}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

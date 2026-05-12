'use client';

import { validatePassword } from '@/utils/validation';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const { strength } = validatePassword(password);

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'good':
        return 'bg-accent-orange';
      case 'strong':
        return 'bg-accent-green';
      default:
        return 'bg-surface-variant';
    }
  };

  const getStrengthPercentage = () => {
    switch (strength) {
      case 'weak':
        return '25%';
      case 'fair':
        return '50%';
      case 'good':
        return '75%';
      case 'strong':
        return '100%';
      default:
        return '0%';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'weak':
        return 'Weak';
      case 'fair':
        return 'Fair';
      case 'good':
        return 'Good';
      case 'strong':
        return 'Strong';
      default:
        return 'Enter password';
    }
  };

  return (
    <div className="space-y-2 px-1 mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Strength:
        </span>
        <span className={`text-xs font-bold uppercase tracking-wider ${
          strength === 'weak' ? 'text-red-500' :
          strength === 'fair' ? 'text-yellow-500' :
          strength === 'good' ? 'text-accent-orange' :
          strength === 'strong' ? 'text-accent-green' :
          'text-text-muted'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden shadow-inner-sm">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: getStrengthPercentage() }}
        />
      </div>
      <div className="space-y-1 mt-2">
        {password && password.length < 8 && (
          <p className="text-xs font-medium text-text-muted">
            • At least 8 characters
          </p>
        )}
        {password && !/[A-Z]/.test(password) && (
          <p className="text-xs font-medium text-text-muted">
            • Include uppercase letter
          </p>
        )}
        {password && !/[0-9]/.test(password) && (
          <p className="text-xs font-medium text-text-muted">
            • Include number
          </p>
        )}
        {password && !/[!@#$%^&*]/.test(password) && (
          <p className="text-xs font-medium text-text-muted">
            • Include special character (!@#$%^&*)
          </p>
        )}
      </div>
    </div>
  );
}

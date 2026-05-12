// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  errors: string[];
} => {
  const errors: string[] = [];
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must include number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must include special character (!@#$%^&*)');
  }

  // Calculate strength
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*]/.test(password),
    password.length >= 12,
  ].filter(Boolean).length;

  if (checks >= 5) strength = 'strong';
  else if (checks >= 4) strength = 'good';
  else if (checks >= 3) strength = 'fair';
  else strength = 'weak';

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
};

// Check if passwords match
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword && password.length > 0;
};

// Full name validation
export const validateFullName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

// Task validation
export const validateTask = (title: string, description?: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!title || title.trim().length === 0) {
    errors.push('Task title is required');
  } else if (title.trim().length > 200) {
    errors.push('Task title must be less than 200 characters');
  }

  if (description && description.length > 2000) {
    errors.push('Task description must be less than 2000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Date validation
export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date > new Date();
};

// Study hours validation
export const validateStudyHours = (hours: number): boolean => {
  return hours > 0 && hours <= 24;
};

// Form field errors collection
export interface FieldError {
  field: string;
  message: string;
}

// Sanitize input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 500);
};

// Validate URL
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate hex color
export const validateHexColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

// Rate limiting check
export const checkRateLimit = (
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  if (typeof window === 'undefined') return true;

  const storedData = localStorage.getItem(`ratelimit_${key}`);
  const now = Date.now();

  if (!storedData) {
    localStorage.setItem(
      `ratelimit_${key}`,
      JSON.stringify({ count: 1, resetTime: now + windowMs })
    );
    return true;
  }

  const data = JSON.parse(storedData);

  if (now > data.resetTime) {
    localStorage.setItem(
      `ratelimit_${key}`,
      JSON.stringify({ count: 1, resetTime: now + windowMs })
    );
    return true;
  }

  if (data.count < maxAttempts) {
    data.count++;
    localStorage.setItem(`ratelimit_${key}`, JSON.stringify(data));
    return true;
  }

  return false;
};

// Get remaining time until rate limit reset
export const getRateLimitResetTime = (key: string): number => {
  if (typeof window === 'undefined') return 0;

  const storedData = localStorage.getItem(`ratelimit_${key}`);
  if (!storedData) return 0;

  const data = JSON.parse(storedData);
  const now = Date.now();
  const remaining = data.resetTime - now;

  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};

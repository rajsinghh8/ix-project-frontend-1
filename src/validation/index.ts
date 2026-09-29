import { MIN_PASSWORD_LENGTH } from '../constants';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequired(value: string, fieldLabel: string): string {
  if (!value.trim()) {
    return `${fieldLabel} is required`;
  }
  return '';
}

export function validateEmail(value: string): string {
  if (!value.trim()) {
    return 'Email is required';
  }
  if (!EMAIL_PATTERN.test(value.trim())) {
    return 'Enter a valid email address';
  }
  return '';
}

export function validatePassword(value: string): string {
  if (!value) {
    return 'Password is required';
  }
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return '';
}

export function validateNumberRange(value: number, min: number, max: number, fieldLabel: string): string {
  if (Number.isNaN(value)) {
    return `${fieldLabel} must be a number`;
  }
  if (value < min || value > max) {
    return `${fieldLabel} must be between ${min} and ${max}`;
  }
  return '';
}

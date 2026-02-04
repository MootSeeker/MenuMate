import React from 'react';
import { View } from 'react-native';
import { cssInterop } from 'nativewind';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });

/**
 * ProgressBar color variants
 */
export type ProgressBarVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

/**
 * ProgressBar size types
 */
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Progress bar color variant */
  variant?: ProgressBarVariant;
  /** Progress bar height */
  size?: ProgressBarSize;
  /** Show value text */
  showValue?: boolean;
  /** Animate the progress bar */
  animated?: boolean;
  /** Additional NativeWind classes */
  className?: string;
}

/**
 * Variant-specific styles
 */
const variantClasses: Record<ProgressBarVariant, string> = {
  primary: 'bg-primary-500 dark:bg-primary-400',
  secondary: 'bg-secondary-500 dark:bg-secondary-400',
  success: 'bg-success-500 dark:bg-success-400',
  warning: 'bg-warning-500 dark:bg-warning-400',
  error: 'bg-error-500 dark:bg-error-400',
};

/**
 * Size-specific styles
 */
const sizeClasses: Record<ProgressBarSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

/**
 * ProgressBar component for showing progress
 *
 * @example
 * ```tsx
 * // Basic progress bar
 * <ProgressBar value={75} />
 *
 * // With different colors
 * <ProgressBar value={100} variant="success" />
 * <ProgressBar value={30} variant="error" />
 *
 * // Different sizes
 * <ProgressBar value={50} size="sm" />
 * <ProgressBar value={50} size="lg" />
 *
 * // Custom max value
 * <ProgressBar value={150} max={200} />
 * ```
 */
export function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  // Clamp value between 0 and max
  const clampedValue = Math.min(Math.max(0, value), max);
  const percentage = (clampedValue / max) * 100;

  const trackClasses = [
    'w-full rounded-full overflow-hidden',
    'bg-gray-200 dark:bg-gray-700',
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const fillClasses = ['h-full rounded-full', variantClasses[variant]].filter(Boolean).join(' ');

  return (
    <View className={trackClasses} accessibilityRole="progressbar">
      <View className={fillClasses} style={{ width: `${percentage}%` }} />
    </View>
  );
}

export default ProgressBar;

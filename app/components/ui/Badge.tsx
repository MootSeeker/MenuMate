import React from 'react';
import { View } from 'react-native';
import { cssInterop } from 'nativewind';
import { Text } from './Text';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });

/**
 * Badge variant types
 */
export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/**
 * Badge size types
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Badge label */
  children: React.ReactNode;
  /** Badge variant */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Show as dot only (no text) */
  dot?: boolean;
  /** Additional NativeWind classes */
  className?: string;
}

/**
 * Variant-specific styles
 */
const variantClasses: Record<BadgeVariant, { bg: string; text: string }> = {
  default: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-foreground dark:text-gray-100',
  },
  primary: {
    bg: 'bg-primary-100 dark:bg-primary-900',
    text: 'text-primary-700 dark:text-primary-300',
  },
  secondary: {
    bg: 'bg-secondary-100 dark:bg-secondary-900',
    text: 'text-secondary-700 dark:text-secondary-300',
  },
  success: {
    bg: 'bg-success-100 dark:bg-success-700/30',
    text: 'text-success-700 dark:text-success-300',
  },
  warning: {
    bg: 'bg-warning-100 dark:bg-warning-700/30',
    text: 'text-warning-700 dark:text-warning-300',
  },
  error: {
    bg: 'bg-error-100 dark:bg-error-700/30',
    text: 'text-error-700 dark:text-error-300',
  },
  info: {
    bg: 'bg-info-100 dark:bg-info-700/30',
    text: 'text-info-700 dark:text-info-300',
  },
};

/**
 * Size-specific styles
 */
const sizeClasses: Record<BadgeSize, { container: string; text: string }> = {
  sm: { container: 'px-1.5 py-0.5', text: 'text-xs' },
  md: { container: 'px-2 py-0.5', text: 'text-sm' },
  lg: { container: 'px-2.5 py-1', text: 'text-base' },
};

/**
 * Dot-only styles
 */
const dotSizeClasses: Record<BadgeSize, string> = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
};

/**
 * Badge component for status indicators and labels
 *
 * @example
 * ```tsx
 * // Default badge
 * <Badge>New</Badge>
 *
 * // Primary badge
 * <Badge variant="primary">Featured</Badge>
 *
 * // Success badge
 * <Badge variant="success">Complete</Badge>
 *
 * // Error badge
 * <Badge variant="error">Failed</Badge>
 *
 * // Dot badge (no text)
 * <Badge variant="success" dot />
 *
 * // Different sizes
 * <Badge size="sm">Small</Badge>
 * <Badge size="lg">Large</Badge>
 * ```
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  const variantStyle = variantClasses[variant];
  const sizeStyle = sizeClasses[size];

  if (dot) {
    const dotClasses = ['rounded-full', variantStyle.bg, dotSizeClasses[size], className]
      .filter(Boolean)
      .join(' ');

    return <View className={dotClasses} />;
  }

  const containerClasses = ['rounded-full', variantStyle.bg, sizeStyle.container, className]
    .filter(Boolean)
    .join(' ');

  return (
    <View className={containerClasses}>
      <Text variant="caption" className={`${variantStyle.text} ${sizeStyle.text} font-medium`}>
        {children}
      </Text>
    </View>
  );
}

export default Badge;

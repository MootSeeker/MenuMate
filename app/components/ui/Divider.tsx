import React from 'react';
import { View } from 'react-native';
import { cssInterop } from 'nativewind';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });

/**
 * Divider orientation
 */
export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  /** Divider orientation */
  orientation?: DividerOrientation;
  /** Add spacing around divider */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /** Additional NativeWind classes */
  className?: string;
}

/**
 * Spacing-specific styles
 */
const spacingClasses: Record<
  'none' | 'sm' | 'md' | 'lg',
  { horizontal: string; vertical: string }
> = {
  none: { horizontal: '', vertical: '' },
  sm: { horizontal: 'my-2', vertical: 'mx-2' },
  md: { horizontal: 'my-4', vertical: 'mx-4' },
  lg: { horizontal: 'my-6', vertical: 'mx-6' },
};

/**
 * Divider component for visual separation
 *
 * @example
 * ```tsx
 * // Horizontal divider (default)
 * <Divider />
 *
 * // Vertical divider
 * <Divider orientation="vertical" />
 *
 * // With spacing
 * <Divider spacing="md" />
 *
 * // Custom styling
 * <Divider className="bg-primary-200" />
 * ```
 */
export function Divider({
  orientation = 'horizontal',
  spacing = 'none',
  className = '',
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';
  const spacingClass = spacingClasses[spacing][orientation];

  const baseClasses = isHorizontal
    ? 'h-px w-full bg-border dark:bg-gray-700'
    : 'w-px h-full bg-border dark:bg-gray-700';

  const combinedClasses = [baseClasses, spacingClass, className].filter(Boolean).join(' ');

  return <View className={combinedClasses} />;
}

export default Divider;

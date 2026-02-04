import React from 'react';
import { View } from 'react-native';
import { cssInterop } from 'nativewind';
import Svg, { Circle } from 'react-native-svg';
import { Text } from './Text';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });

/**
 * ProgressRing color variants
 */
export type ProgressRingVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

/**
 * ProgressRing size types
 */
export type ProgressRingSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ProgressRingProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Progress ring color variant */
  variant?: ProgressRingVariant;
  /** Progress ring size */
  size?: ProgressRingSize;
  /** Show value in center */
  showValue?: boolean;
  /** Custom center content */
  children?: React.ReactNode;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional NativeWind classes */
  className?: string;
}

/**
 * Variant colors for stroke
 */
const variantColors: Record<ProgressRingVariant, string> = {
  primary: '#22c55e',
  secondary: '#f97316',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
};

/**
 * Size-specific dimensions
 */
const sizeDimensions: Record<ProgressRingSize, { size: number; stroke: number }> = {
  sm: { size: 40, stroke: 4 },
  md: { size: 64, stroke: 6 },
  lg: { size: 96, stroke: 8 },
  xl: { size: 128, stroke: 10 },
};

/**
 * ProgressRing component for circular progress indication
 *
 * @example
 * ```tsx
 * // Basic progress ring
 * <ProgressRing value={75} />
 *
 * // With value displayed
 * <ProgressRing value={75} showValue />
 *
 * // With custom center content
 * <ProgressRing value={50}>
 *   <Text>50%</Text>
 * </ProgressRing>
 *
 * // Different variants
 * <ProgressRing value={100} variant="success" />
 *
 * // Different sizes
 * <ProgressRing value={50} size="xl" showValue />
 * ```
 */
export function ProgressRing({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showValue = false,
  children,
  strokeWidth: customStrokeWidth,
  className = '',
}: ProgressRingProps) {
  const { size: ringSize, stroke: defaultStroke } = sizeDimensions[size];
  const strokeWidth = customStrokeWidth ?? defaultStroke;

  // Clamp value between 0 and max
  const clampedValue = Math.min(Math.max(0, value), max);
  const percentage = (clampedValue / max) * 100;

  // Calculate circle properties
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const progressColor = variantColors[variant];
  const trackColor = '#e5e7eb'; // gray-200

  return (
    <View
      className={`items-center justify-center ${className}`}
      style={{ width: ringSize, height: ringSize }}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: max,
        now: clampedValue,
      }}
    >
      <Svg width={ringSize} height={ringSize}>
        {/* Background track */}
        <Circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          origin={`${ringSize / 2}, ${ringSize / 2}`}
        />
      </Svg>

      {/* Center content */}
      <View
        className="absolute items-center justify-center"
        style={{ width: ringSize - strokeWidth * 2, height: ringSize - strokeWidth * 2 }}
      >
        {children ? (
          children
        ) : showValue ? (
          <Text variant={size === 'sm' ? 'caption' : 'body-md'} className="font-semibold">
            {Math.round(percentage)}%
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default ProgressRing;

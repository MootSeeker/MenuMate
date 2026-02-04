import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import { cssInterop } from 'nativewind';
import { Text } from './Text';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });
cssInterop(Image, { className: 'style' });

/**
 * Avatar size types
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Image source */
  source?: ImageSourcePropType;
  /** Fallback text (initials) when no image */
  fallback?: string;
  /** Avatar size */
  size?: AvatarSize;
  /** Additional NativeWind classes */
  className?: string;
}

/**
 * Size-specific styles
 */
const sizeClasses: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: 'h-6 w-6', text: 'text-xs' },
  sm: { container: 'h-8 w-8', text: 'text-sm' },
  md: { container: 'h-10 w-10', text: 'text-base' },
  lg: { container: 'h-12 w-12', text: 'text-lg' },
  xl: { container: 'h-16 w-16', text: 'text-xl' },
};

/**
 * Generate initials from a name
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Avatar component displaying an image or initials
 *
 * @example
 * ```tsx
 * // With image
 * <Avatar source={{ uri: 'https://example.com/photo.jpg' }} />
 *
 * // With initials fallback
 * <Avatar fallback="John Doe" />
 *
 * // Different sizes
 * <Avatar size="xs" fallback="JD" />
 * <Avatar size="xl" source={...} />
 * ```
 */
export function Avatar({ source, fallback, size = 'md', className = '' }: AvatarProps) {
  const sizeStyle = sizeClasses[size];
  const baseClasses = 'rounded-full items-center justify-center bg-primary-100 dark:bg-primary-900';

  const containerClasses = [baseClasses, sizeStyle.container, className].filter(Boolean).join(' ');

  if (source) {
    return (
      <Image
        source={source}
        className={`${sizeStyle.container} rounded-full ${className}`}
        accessibilityRole="image"
      />
    );
  }

  const initials = fallback ? getInitials(fallback) : '?';

  return (
    <View className={containerClasses} accessibilityRole="image">
      <Text
        variant="label"
        className={`${sizeStyle.text} font-semibold text-primary-700 dark:text-primary-300`}
      >
        {initials}
      </Text>
    </View>
  );
}

export default Avatar;

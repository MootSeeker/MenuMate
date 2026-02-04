import React from 'react';
import { View, Pressable, PressableProps, ViewProps } from 'react-native';
import { cssInterop } from 'nativewind';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });
cssInterop(Pressable, { className: 'style' });

/**
 * Card variant types
 */
export type CardVariant = 'elevated' | 'outlined' | 'flat';

/**
 * Card padding sizes
 */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends ViewProps {
  /** Card visual variant */
  variant?: CardVariant;
  /** Card padding */
  padding?: CardPadding;
  /** Make the card pressable */
  pressable?: boolean;
  /** Handler for press events (only when pressable) */
  onPress?: PressableProps['onPress'];
  /** Children content */
  children: React.ReactNode;
  /** Additional NativeWind classes */
  className?: string;
}

/**
 * Variant-specific styles
 */
const variantClasses: Record<CardVariant, string> = {
  elevated:
    'bg-surface dark:bg-gray-800 shadow-card border-0',
  outlined:
    'bg-surface dark:bg-gray-800 border border-border dark:border-gray-700',
  flat: 'bg-background-secondary dark:bg-gray-800/50 border-0',
};

/**
 * Padding-specific styles
 */
const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

/**
 * Card component for containing related content
 *
 * @example
 * ```tsx
 * // Elevated card (default)
 * <Card>
 *   <Text>Card content</Text>
 * </Card>
 *
 * // Outlined card
 * <Card variant="outlined">
 *   <Text>Outlined card</Text>
 * </Card>
 *
 * // Flat card
 * <Card variant="flat">
 *   <Text>Flat card</Text>
 * </Card>
 *
 * // Pressable card
 * <Card pressable onPress={handlePress}>
 *   <Text>Tap me!</Text>
 * </Card>
 *
 * // Custom padding
 * <Card padding="lg">
 *   <Text>Large padding card</Text>
 * </Card>
 *
 * // No padding (for custom layouts)
 * <Card padding="none">
 *   <Image source={...} />
 *   <View className="p-4">
 *     <Text>Content below image</Text>
 *   </View>
 * </Card>
 * ```
 */
export function Card({
  variant = 'elevated',
  padding = 'md',
  pressable = false,
  onPress,
  children,
  className = '',
  ...props
}: CardProps) {
  const baseClasses = 'rounded-xl overflow-hidden';
  const variantClass = variantClasses[variant];
  const paddingClass = paddingClasses[padding];

  const combinedClasses = [baseClasses, variantClass, paddingClass, className]
    .filter(Boolean)
    .join(' ');

  if (pressable) {
    return (
      <Pressable
        className={`${combinedClasses} active:opacity-80`}
        onPress={onPress}
        accessibilityRole="button"
        {...(props as PressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={combinedClasses} {...props}>
      {children}
    </View>
  );
}

/**
 * CardHeader component for card title sections
 */
export interface CardHeaderProps {
  /** Header title */
  title?: React.ReactNode;
  /** Header subtitle or description */
  subtitle?: React.ReactNode;
  /** Action element (e.g., icon button) */
  action?: React.ReactNode;
  /** Additional NativeWind classes */
  className?: string;
  /** Children (alternative to title/subtitle) */
  children?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = '',
  children,
}: CardHeaderProps) {
  if (children) {
    return <View className={`pb-3 ${className}`}>{children}</View>;
  }

  return (
    <View className={`flex-row items-center justify-between pb-3 ${className}`}>
      <View className="flex-1">
        {title && (
          <View className="text-heading-4 text-foreground dark:text-gray-50">
            {title}
          </View>
        )}
        {subtitle && (
          <View className="text-body-sm text-foreground-secondary dark:text-gray-400 mt-0.5">
            {subtitle}
          </View>
        )}
      </View>
      {action && <View className="ml-3">{action}</View>}
    </View>
  );
}

/**
 * CardContent component for main card content
 */
export interface CardContentProps {
  /** Children content */
  children: React.ReactNode;
  /** Additional NativeWind classes */
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <View className={className}>{children}</View>;
}

/**
 * CardFooter component for card action sections
 */
export interface CardFooterProps {
  /** Children content */
  children: React.ReactNode;
  /** Additional NativeWind classes */
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <View
      className={`flex-row items-center justify-end pt-3 gap-2 ${className}`}
    >
      {children}
    </View>
  );
}

export default Card;

import React from 'react';
import {
  Pressable,
  PressableProps,
  ActivityIndicator,
  View,
} from 'react-native';
import { cssInterop } from 'nativewind';
import { Text } from './Text';

// Enable NativeWind styling
cssInterop(Pressable, { className: 'style' });
cssInterop(View, { className: 'style' });
cssInterop(ActivityIndicator, { className: 'style' });

/**
 * Button variant types
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Button label text */
  children: React.ReactNode;
  /** Show loading spinner */
  loading?: boolean;
  /** Disable the button */
  disabled?: boolean;
  /** Icon to show before text */
  leftIcon?: React.ReactNode;
  /** Icon to show after text */
  rightIcon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Additional NativeWind classes */
  className?: string;
}

/**
 * Base styles for all buttons
 */
const baseClasses =
  'flex-row items-center justify-center rounded-lg active:opacity-80';

/**
 * Variant-specific styles
 */
const variantClasses: Record<
  ButtonVariant,
  { container: string; text: string; spinner: string }
> = {
  primary: {
    container: 'bg-primary-500 dark:bg-primary-600',
    text: 'text-white',
    spinner: '#ffffff',
  },
  secondary: {
    container: 'bg-secondary-500 dark:bg-secondary-600',
    text: 'text-white',
    spinner: '#ffffff',
  },
  outline: {
    container:
      'bg-transparent border-2 border-primary-500 dark:border-primary-400',
    text: 'text-primary-500 dark:text-primary-400',
    spinner: '#22c55e',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-foreground dark:text-gray-100',
    spinner: '#111827',
  },
  destructive: {
    container: 'bg-error-500 dark:bg-error-600',
    text: 'text-white',
    spinner: '#ffffff',
  },
};

/**
 * Size-specific styles
 */
const sizeClasses: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: 'h-8 px-3 gap-1.5',
    text: 'text-sm',
  },
  md: {
    container: 'h-10 px-4 gap-2',
    text: 'text-base',
  },
  lg: {
    container: 'h-12 px-5 gap-2.5',
    text: 'text-lg',
  },
};

/**
 * Disabled styles
 */
const disabledClasses = 'opacity-50';

/**
 * Button component with multiple variants, sizes, and states
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button onPress={handlePress}>Click me</Button>
 *
 * // Secondary button with loading
 * <Button variant="secondary" loading>Saving...</Button>
 *
 * // Outline button with icon
 * <Button variant="outline" leftIcon={<Icon name="plus" />}>Add Item</Button>
 *
 * // Destructive button
 * <Button variant="destructive" onPress={handleDelete}>Delete</Button>
 *
 * // Ghost button (text only)
 * <Button variant="ghost">Cancel</Button>
 *
 * // Different sizes
 * <Button size="sm">Small</Button>
 * <Button size="md">Medium</Button>
 * <Button size="lg">Large</Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = variantClasses[variant];
  const sizeStyle = sizeClasses[size];

  const containerClasses = [
    baseClasses,
    variantStyle.container,
    sizeStyle.container,
    fullWidth ? 'w-full' : '',
    isDisabled ? disabledClasses : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Pressable
      className={containerClasses}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyle.spinner}
          className="mr-2"
        />
      ) : leftIcon ? (
        <View className="mr-1">{leftIcon}</View>
      ) : null}

      <Text
        variant="label"
        className={`${variantStyle.text} ${sizeStyle.text} font-semibold`}
      >
        {children}
      </Text>

      {rightIcon && !loading ? <View className="ml-1">{rightIcon}</View> : null}
    </Pressable>
  );
}

/**
 * IconButton - A button that only contains an icon
 */
export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Show loading spinner */
  loading?: boolean;
  /** Disable the button */
  disabled?: boolean;
  /** Accessibility label (required for icon-only buttons) */
  accessibilityLabel: string;
  /** Additional NativeWind classes */
  className?: string;
}

/**
 * Icon button sizes (square)
 */
const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  accessibilityLabel,
  className = '',
  ...props
}: IconButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = variantClasses[variant];

  const containerClasses = [
    'items-center justify-center rounded-full active:opacity-80',
    variantStyle.container,
    iconSizeClasses[size],
    isDisabled ? disabledClasses : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Pressable
      className={containerClasses}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.spinner} />
      ) : (
        icon
      )}
    </Pressable>
  );
}

export default Button;

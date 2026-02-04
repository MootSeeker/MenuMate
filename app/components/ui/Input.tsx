import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Pressable,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { cssInterop } from 'nativewind';
import { Text, Label } from './Text';

// Enable NativeWind styling
cssInterop(TextInput, { className: 'style' });
cssInterop(View, { className: 'style' });
cssInterop(Pressable, { className: 'style' });

/**
 * Input type variants
 */
export type InputType = 'text' | 'email' | 'password' | 'number' | 'phone';

export interface InputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  /** Label text displayed above the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Error message to display */
  error?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Input type (affects keyboard and security) */
  type?: InputType;
  /** Disable the input */
  disabled?: boolean;
  /** Icon component to display on the left */
  leftIcon?: React.ReactNode;
  /** Icon component to display on the right */
  rightIcon?: React.ReactNode;
  /** Additional container classes */
  containerClassName?: string;
  /** Additional input classes */
  className?: string;
}

/**
 * Eye icon for password visibility toggle (simple SVG-like representation)
 */
function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <Text
      variant="body-md"
      color="tertiary"
      className="text-lg"
      accessibilityLabel={visible ? 'Passwort verbergen' : 'Passwort anzeigen'}
    >
      {visible ? '👁' : '👁‍🗨'}
    </Text>
  );
}

/**
 * Get keyboard type based on input type
 */
function getKeyboardType(
  type: InputType
): TextInputProps['keyboardType'] {
  switch (type) {
    case 'email':
      return 'email-address';
    case 'number':
      return 'numeric';
    case 'phone':
      return 'phone-pad';
    default:
      return 'default';
  }
}

/**
 * Get autoCapitalize based on input type
 */
function getAutoCapitalize(
  type: InputType
): TextInputProps['autoCapitalize'] {
  switch (type) {
    case 'email':
    case 'password':
      return 'none';
    default:
      return 'sentences';
  }
}

/**
 * Input component for forms with label, error state, and various types
 *
 * @example
 * ```tsx
 * // Basic text input
 * <Input
 *   label="Name"
 *   placeholder="Enter your name"
 *   value={name}
 *   onChangeText={setName}
 * />
 *
 * // Email input
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 *
 * // Password input (with show/hide toggle)
 * <Input
 *   label="Password"
 *   type="password"
 *   placeholder="Enter password"
 *   value={password}
 *   onChangeText={setPassword}
 * />
 *
 * // Input with error
 * <Input
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChangeText={setEmail}
 *   error="Please enter a valid email address"
 * />
 *
 * // Input with icons
 * <Input
 *   label="Search"
 *   placeholder="Search..."
 *   leftIcon={<SearchIcon />}
 * />
 *
 * // Integration with React Hook Form
 * <Controller
 *   control={control}
 *   name="email"
 *   render={({ field, fieldState }) => (
 *     <Input
 *       {...field}
 *       label="Email"
 *       type="email"
 *       error={fieldState.error?.message}
 *     />
 *   )}
 * />
 * ```
 */
export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    placeholder,
    error,
    helperText,
    type = 'text',
    disabled = false,
    leftIcon,
    rightIcon,
    containerClassName = '',
    className = '',
    onFocus,
    onBlur,
    ...props
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const hasError = Boolean(error);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Build border color classes based on state
  const getBorderColorClass = () => {
    if (hasError) {
      return 'border-error-500 dark:border-error-400';
    }
    if (isFocused) {
      return 'border-primary-500 dark:border-primary-400';
    }
    return 'border-border dark:border-gray-600';
  };

  // Build background color class
  const getBackgroundClass = () => {
    if (disabled) {
      return 'bg-gray-100 dark:bg-gray-800';
    }
    return 'bg-white dark:bg-gray-900';
  };

  const inputContainerClasses = [
    'flex-row items-center',
    'h-12 px-4',
    'rounded-lg border-2',
    getBorderColorClass(),
    getBackgroundClass(),
    disabled ? 'opacity-60' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [
    'flex-1 h-full',
    'text-foreground dark:text-gray-50',
    'text-body-md',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <View className={`gap-1.5 ${containerClassName}`}>
      {label && <Label>{label}</Label>}

      <View className={inputContainerClasses}>
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <TextInput
          ref={ref}
          className={inputClasses}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          editable={!disabled}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={getKeyboardType(type)}
          autoCapitalize={getAutoCapitalize(type)}
          autoCorrect={type !== 'email' && type !== 'password'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label}
          accessibilityHint={helperText}
          accessibilityState={{
            disabled,
          }}
          {...props}
        />

        {isPassword && (
          <Pressable
            onPress={togglePasswordVisibility}
            className="ml-2 p-1"
            accessibilityRole="button"
            accessibilityLabel={
              showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'
            }
          >
            <EyeIcon visible={showPassword} />
          </Pressable>
        )}

        {rightIcon && !isPassword && <View className="ml-3">{rightIcon}</View>}
      </View>

      {(error || helperText) && (
        <Text
          variant="caption"
          color={hasError ? 'error' : 'tertiary'}
          className="ml-1"
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

/**
 * TextArea component for multi-line text input
 */
export interface TextAreaProps extends Omit<InputProps, 'type'> {
  /** Number of lines to show */
  numberOfLines?: number;
}

export const TextArea = forwardRef<TextInput, TextAreaProps>(function TextArea(
  { numberOfLines = 4, className = '', ...props },
  ref
) {
  return (
    <Input
      ref={ref}
      multiline
      numberOfLines={numberOfLines}
      className={`min-h-[100px] py-3 ${className}`}
      textAlignVertical="top"
      {...props}
    />
  );
});

export default Input;

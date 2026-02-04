import React, { useEffect, useRef } from 'react';
import { View, Animated, Pressable } from 'react-native';
import { cssInterop } from 'nativewind';
import { Text } from './Text';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });
cssInterop(Pressable, { className: 'style' });

/**
 * Toast variant types
 */
export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

/**
 * Toast position types
 */
export type ToastPosition = 'top' | 'bottom';

export interface ToastProps {
  /** Toast message */
  message: string;
  /** Toast title (optional) */
  title?: string;
  /** Toast variant */
  variant?: ToastVariant;
  /** Toast position */
  position?: ToastPosition;
  /** Duration in milliseconds (0 = persistent) */
  duration?: number;
  /** Whether toast is visible */
  visible: boolean;
  /** Callback when toast should be dismissed */
  onDismiss?: () => void;
  /** Action button text */
  actionText?: string;
  /** Action button callback */
  onAction?: () => void;
}

/**
 * Variant-specific styles
 */
const variantClasses: Record<ToastVariant, { container: string; icon: string }> = {
  default: {
    container: 'bg-gray-800 dark:bg-gray-100',
    icon: '💬',
  },
  success: {
    container: 'bg-success-600 dark:bg-success-500',
    icon: '✓',
  },
  warning: {
    container: 'bg-warning-600 dark:bg-warning-500',
    icon: '⚠',
  },
  error: {
    container: 'bg-error-600 dark:bg-error-500',
    icon: '✕',
  },
  info: {
    container: 'bg-info-600 dark:bg-info-500',
    icon: 'ℹ',
  },
};

/**
 * Toast component for notifications
 *
 * @example
 * ```tsx
 * const [showToast, setShowToast] = useState(false);
 *
 * <Toast
 *   visible={showToast}
 *   message="Changes saved successfully!"
 *   variant="success"
 *   onDismiss={() => setShowToast(false)}
 * />
 *
 * // With title and action
 * <Toast
 *   visible={showError}
 *   title="Error"
 *   message="Failed to save changes"
 *   variant="error"
 *   actionText="Retry"
 *   onAction={handleRetry}
 *   onDismiss={() => setShowError(false)}
 * />
 * ```
 */
export function Toast({
  message,
  title,
  variant = 'default',
  position = 'bottom',
  duration = 3000,
  visible,
  onDismiss,
  actionText,
  onAction,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -20 : 20)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      if (duration > 0 && onDismiss) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: position === 'top' ? -20 : 20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, duration]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -20 : 20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  if (!visible) return null;

  const variantStyle = variantClasses[variant];
  const positionClass = position === 'top' ? 'top-12' : 'bottom-12';

  return (
    <Animated.View
      className={`absolute left-4 right-4 ${positionClass} z-50`}
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      <Pressable
        onPress={onDismiss}
        className={`flex-row items-center ${variantStyle.container} rounded-lg px-4 py-3 shadow-lg`}
      >
        <Text variant="body-md" className="mr-2 text-white">
          {variantStyle.icon}
        </Text>

        <View className="flex-1">
          {title && (
            <Text variant="label" className="font-semibold text-white">
              {title}
            </Text>
          )}
          <Text variant="body-sm" className="text-white/90">
            {message}
          </Text>
        </View>

        {actionText && onAction && (
          <Pressable onPress={onAction} className="ml-3 rounded bg-white/20 px-2 py-1">
            <Text variant="label" className="font-semibold text-white">
              {actionText}
            </Text>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default Toast;

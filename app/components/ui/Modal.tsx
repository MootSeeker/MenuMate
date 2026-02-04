import React, { useEffect, useRef } from 'react';
import {
  View,
  Pressable,
  Animated,
  Modal as RNModal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { cssInterop } from 'nativewind';
import { Text } from './Text';
import { IconButton } from './Button';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });
cssInterop(Pressable, { className: 'style' });
cssInterop(KeyboardAvoidingView, { className: 'style' });

export interface ModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Close on backdrop press */
  closeOnBackdrop?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Children content */
  children: React.ReactNode;
  /** Additional container classes */
  className?: string;
}

/**
 * Modal component for dialogs and overlays
 *
 * @example
 * ```tsx
 * const [showModal, setShowModal] = useState(false);
 *
 * <Modal
 *   visible={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Confirm Action"
 * >
 *   <Text>Are you sure you want to continue?</Text>
 *   <View className="flex-row gap-3 mt-4">
 *     <Button variant="ghost" onPress={() => setShowModal(false)}>
 *       Cancel
 *     </Button>
 *     <Button onPress={handleConfirm}>
 *       Confirm
 *     </Button>
 *   </View>
 * </Modal>
 * ```
 */
export function Modal({
  visible,
  onClose,
  title,
  closeOnBackdrop = true,
  showCloseButton = true,
  children,
  className = '',
}: ModalProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Animated.View className="flex-1 items-center justify-center" style={{ opacity }}>
          {/* Backdrop */}
          <Pressable onPress={handleBackdropPress} className="absolute inset-0 bg-black/50" />

          {/* Modal content */}
          <Animated.View
            className={`mx-4 w-full max-w-lg rounded-2xl bg-surface shadow-xl dark:bg-gray-800 ${className}`}
            style={{ transform: [{ scale }] }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
                {title ? (
                  <Text variant="heading-4" className="flex-1">
                    {title}
                  </Text>
                ) : (
                  <View className="flex-1" />
                )}
                {showCloseButton && (
                  <IconButton
                    icon={<Text className="text-lg">✕</Text>}
                    variant="ghost"
                    size="sm"
                    accessibilityLabel="Schließen"
                    onPress={onClose}
                  />
                )}
              </View>
            )}

            {/* Content */}
            <View className="px-4 pb-4">{children}</View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

export default Modal;

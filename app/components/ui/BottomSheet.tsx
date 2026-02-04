import React, { useEffect, useRef } from 'react';
import {
  View,
  Pressable,
  Animated,
  Modal as RNModal,
  Dimensions,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { cssInterop } from 'nativewind';
import { Text } from './Text';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });
cssInterop(Pressable, { className: 'style' });
cssInterop(KeyboardAvoidingView, { className: 'style' });

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  /** Whether the bottom sheet is visible */
  visible: boolean;
  /** Callback when sheet should close */
  onClose: () => void;
  /** Sheet title */
  title?: string;
  /** Height of the sheet ('auto' or percentage like '50%') */
  height?: 'auto' | string;
  /** Show drag handle */
  showHandle?: boolean;
  /** Close on backdrop press */
  closeOnBackdrop?: boolean;
  /** Enable drag to dismiss */
  enableDragToDismiss?: boolean;
  /** Children content */
  children: React.ReactNode;
  /** Additional container classes */
  className?: string;
}

/**
 * BottomSheet component for content sliding up from the bottom
 *
 * @example
 * ```tsx
 * const [showSheet, setShowSheet] = useState(false);
 *
 * <BottomSheet
 *   visible={showSheet}
 *   onClose={() => setShowSheet(false)}
 *   title="Select Option"
 * >
 *   <Pressable onPress={() => handleSelect('option1')}>
 *     <Text>Option 1</Text>
 *   </Pressable>
 *   <Pressable onPress={() => handleSelect('option2')}>
 *     <Text>Option 2</Text>
 *   </Pressable>
 * </BottomSheet>
 *
 * // With custom height
 * <BottomSheet
 *   visible={showSheet}
 *   onClose={() => setShowSheet(false)}
 *   height="70%"
 * >
 *   <ScrollView>
 *     {/* Long content *\/}
 *   </ScrollView>
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  height = 'auto',
  showHandle = true,
  closeOnBackdrop = true,
  enableDragToDismiss = true,
  children,
  className = '',
}: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Pan responder for drag to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enableDragToDismiss,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return enableDragToDismiss && gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          // Dismiss if dragged far enough or fast enough
          onClose();
        } else {
          // Snap back
          Animated.spring(translateY, {
            toValue: 0,
            tension: 100,
            friction: 10,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
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

  // Calculate height style
  const getHeightStyle = () => {
    if (height === 'auto') {
      return {};
    }
    if (height.includes('%')) {
      const percentage = parseInt(height, 10) / 100;
      return { maxHeight: SCREEN_HEIGHT * percentage };
    }
    return { maxHeight: parseInt(height, 10) };
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
        <View className="flex-1 justify-end">
          {/* Backdrop */}
          <Animated.View className="absolute inset-0" style={{ opacity: backdropOpacity }}>
            <Pressable onPress={handleBackdropPress} className="flex-1 bg-black/50" />
          </Animated.View>

          {/* Sheet content */}
          <Animated.View
            className={`rounded-t-3xl bg-surface shadow-xl dark:bg-gray-800 ${className}`}
            style={[{ transform: [{ translateY }] }, getHeightStyle()]}
          >
            {/* Drag handle */}
            {showHandle && (
              <View {...panResponder.panHandlers} className="items-center pb-2 pt-3">
                <View className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
              </View>
            )}

            {/* Header with title */}
            {title && (
              <View className="border-b border-border px-4 py-2 dark:border-gray-700">
                <Text variant="heading-4" className="text-center">
                  {title}
                </Text>
              </View>
            )}

            {/* Content */}
            <View className="px-4 py-4">{children}</View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

export default BottomSheet;

/**
 * Password Strength Indicator Component
 *
 * Visual indicator for password strength with progress bar and label
 */

import { View } from 'react-native';
import { Text, ProgressBar } from '@/components/ui';
import {
  calculatePasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
} from '../utils/passwordStrength';

interface PasswordStrengthIndicatorProps {
  password: string;
  showFeedback?: boolean;
}

export function PasswordStrengthIndicator({
  password,
  showFeedback = false,
}: PasswordStrengthIndicatorProps) {
  const { strength, score, feedback } = calculatePasswordStrength(password);
  const colors = getPasswordStrengthColor(strength);
  const label = getPasswordStrengthLabel(strength);

  // Don't show anything if password is empty
  if (!password) {
    return null;
  }

  return (
    <View className="mt-2">
      {/* Progress Bar */}
      <View className="mb-1 flex-row items-center gap-2">
        <View className="flex-1">
          <ProgressBar value={(score / 4) * 100} size="sm" />
        </View>
        <Text variant="caption" className={colors.text}>
          {label}
        </Text>
      </View>

      {/* Feedback */}
      {showFeedback && feedback.length > 0 && (
        <View className="mt-1">
          {feedback.map((item, index) => (
            <Text key={index} variant="caption" className="text-gray-600 dark:text-gray-400">
              • {item}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * Step 2: Body Data Screen
 *
 * Captures height and current weight from the user.
 * Shows BMI preview as optional feedback.
 *
 * @see Issue #18 - [ONBOARD-001-B] Onboarding Step 2: Body Data
 */

import { useCallback, useState, useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, Input, Card, Badge } from '@/components/ui';
import { VALIDATION } from '@/features/user/utils';

import { OnboardingLayout } from '../components';
import { useOnboardingStore } from '../stores';

// ============================================
// TYPES
// ============================================

interface ValidationErrors {
  height?: string;
  weight?: string;
}

interface BMICategory {
  label: string;
  color: 'info' | 'success' | 'warning' | 'error';
  minBMI: number;
  maxBMI: number;
}

// ============================================
// CONSTANTS
// ============================================

const BMI_CATEGORIES: BMICategory[] = [
  { label: 'Untergewicht', color: 'info', minBMI: 0, maxBMI: 18.5 },
  { label: 'Normalgewicht', color: 'success', minBMI: 18.5, maxBMI: 25 },
  { label: 'Übergewicht', color: 'warning', minBMI: 25, maxBMI: 30 },
  { label: 'Adipositas', color: 'error', minBMI: 30, maxBMI: Infinity },
];

// ============================================
// HELPERS
// ============================================

/**
 * Calculate BMI from height (cm) and weight (kg)
 */
function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/**
 * Get BMI category based on BMI value
 */
function getBMICategory(bmi: number): BMICategory {
  return BMI_CATEGORIES.find((cat) => bmi >= cat.minBMI && bmi < cat.maxBMI) ?? BMI_CATEGORIES[0];
}

/**
 * Validate body data inputs
 */
function validateInputs(height: string, weight: string): ValidationErrors {
  const errors: ValidationErrors = {};

  const heightNum = parseFloat(height);
  const weightNum = parseFloat(weight);

  if (!height) {
    errors.height = 'Bitte gib deine Größe ein';
  } else if (isNaN(heightNum)) {
    errors.height = 'Bitte gib eine gültige Zahl ein';
  } else if (heightNum < VALIDATION.MIN_HEIGHT_CM || heightNum > VALIDATION.MAX_HEIGHT_CM) {
    errors.height = `Größe muss zwischen ${VALIDATION.MIN_HEIGHT_CM} und ${VALIDATION.MAX_HEIGHT_CM} cm liegen`;
  }

  if (!weight) {
    errors.weight = 'Bitte gib dein Gewicht ein';
  } else if (isNaN(weightNum)) {
    errors.weight = 'Bitte gib eine gültige Zahl ein';
  } else if (weightNum < VALIDATION.MIN_WEIGHT_KG || weightNum > VALIDATION.MAX_WEIGHT_KG) {
    errors.weight = `Gewicht muss zwischen ${VALIDATION.MIN_WEIGHT_KG} und ${VALIDATION.MAX_WEIGHT_KG} kg liegen`;
  }

  return errors;
}

// ============================================
// COMPONENT
// ============================================

export function Step2BodyScreen() {
  const router = useRouter();
  const { data, setBodyData, nextStep, prevStep } = useOnboardingStore();

  // Local form state
  const [height, setHeight] = useState(data.heightCm?.toString() ?? '');
  const [weight, setWeight] = useState(data.weightKg?.toString() ?? '');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({ height: false, weight: false });

  // Derived values
  const heightNum = parseFloat(height);
  const weightNum = parseFloat(weight);
  const hasValidInputs = !isNaN(heightNum) && !isNaN(weightNum) && heightNum > 0 && weightNum > 0;
  const bmi = hasValidInputs ? calculateBMI(heightNum, weightNum) : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  // Validate on change (after touch)
  useEffect(() => {
    if (touched.height || touched.weight) {
      const newErrors = validateInputs(
        touched.height ? height : (data.heightCm?.toString() ?? ''),
        touched.weight ? weight : (data.weightKg?.toString() ?? '')
      );
      setErrors(newErrors);
    }
  }, [height, weight, touched, data.heightCm, data.weightKg]);

  // Handle next button
  const handleNext = useCallback(() => {
    const validationErrors = validateInputs(height, weight);
    setErrors(validationErrors);
    setTouched({ height: true, weight: true });

    if (Object.keys(validationErrors).length === 0) {
      setBodyData(heightNum, weightNum);
      nextStep();
      router.push('/onboarding/step3');
    }
  }, [height, weight, heightNum, weightNum, setBodyData, nextStep, router]);

  // Handle back button
  const handleBack = useCallback(() => {
    // Save current values even when going back
    if (hasValidInputs) {
      setBodyData(heightNum, weightNum);
    }
    prevStep();
    router.back();
  }, [hasValidInputs, heightNum, weightNum, setBodyData, prevStep, router]);

  // Check if can proceed
  const canProceed = hasValidInputs && Object.keys(errors).length === 0;

  return (
    <OnboardingLayout
      currentStep={2}
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!canProceed}
    >
      <View className="flex-1 py-4">
        {/* Title */}
        <Text variant="heading-2" className="mb-2 text-center">
          Deine Körperdaten
        </Text>
        <Text variant="body-md" color="secondary" className="mb-8 text-center">
          Diese Daten helfen uns, deinen Kalorienbedarf genau zu berechnen.
        </Text>

        {/* Height Input */}
        <View className="mb-6">
          <Input
            label="Größe"
            placeholder="z.B. 175"
            value={height}
            onChangeText={(text) => {
              // Only allow numbers
              const filtered = text.replace(/[^0-9]/g, '');
              setHeight(filtered);
            }}
            onBlur={() => setTouched((t) => ({ ...t, height: true }))}
            keyboardType="number-pad"
            error={touched.height ? errors.height : undefined}
            helperText="cm"
            accessibilityLabel="Größe in Zentimetern"
          />
        </View>

        {/* Weight Input */}
        <View className="mb-8">
          <Input
            label="Gewicht"
            placeholder="z.B. 70.5"
            value={weight}
            onChangeText={(text) => {
              // Allow numbers and one decimal point
              const filtered = text.replace(/[^0-9.]/g, '');
              // Prevent multiple decimal points
              const parts = filtered.split('.');
              if (parts.length > 2) {
                setWeight(parts[0] + '.' + parts.slice(1).join(''));
              } else {
                setWeight(filtered);
              }
            }}
            onBlur={() => setTouched((t) => ({ ...t, weight: true }))}
            keyboardType="decimal-pad"
            error={touched.weight ? errors.weight : undefined}
            helperText="kg"
            accessibilityLabel="Gewicht in Kilogramm"
          />
        </View>

        {/* BMI Preview Card */}
        {bmi !== null && bmiCategory && (
          <Card variant="outlined" padding="md" className="mb-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text variant="caption" color="tertiary">
                  Dein aktueller BMI
                </Text>
                <Text variant="heading-3">{bmi.toFixed(1)}</Text>
              </View>
              <Badge variant={bmiCategory.color} size="md">
                {bmiCategory.label}
              </Badge>
            </View>

            <Text variant="caption" color="tertiary" className="mt-3">
              Der BMI ist ein grober Richtwert. Dein individueller Kalorienbedarf wird im nächsten
              Schritt basierend auf deiner Aktivität berechnet.
            </Text>
          </Card>
        )}

        {/* Info Text */}
        <Card variant="flat" padding="md">
          <Text variant="body-sm" color="secondary">
            💡 <Text variant="body-sm">Tipp:</Text> Wiege dich am besten morgens nach dem Aufstehen
            für ein konsistentes Ergebnis.
          </Text>
        </Card>
      </View>
    </OnboardingLayout>
  );
}

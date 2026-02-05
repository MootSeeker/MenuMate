/**
 * Registration Screen
 *
 * Allows new users to create an account with email and password.
 * Includes form validation using React Hook Form and Zod.
 *
 * @see Issue #12 - [AUTH-003] Registration Screen UI
 */

import { useCallback, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { Text, Input, Button, Card } from '@/components/ui';
import { useAuthStore } from '../stores';

// ============================================
// VALIDATION SCHEMA
// ============================================

/**
 * Zod schema for registration form validation
 */
const registrationSchema = z
  .object({
    email: z
      .string()
      .min(1, 'E-Mail ist erforderlich')
      .email('Bitte gib eine gültige E-Mail-Adresse ein'),
    password: z
      .string()
      .min(1, 'Passwort ist erforderlich')
      .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
      .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten'),
    confirmPassword: z.string().min(1, 'Passwort-Bestätigung ist erforderlich'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

// ============================================
// CUSTOM RESOLVER
// ============================================

/**
 * Custom resolver for Zod v4 with react-hook-form
 */
function zodResolver(schema: z.ZodType<RegistrationFormData>) {
  return async (data: RegistrationFormData) => {
    const result = schema.safeParse(data);
    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      if (!errors[path]) {
        errors[path] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }
    return { values: {}, errors };
  };
}

// ============================================
// COMPONENT
// ============================================

export function RegisterScreen() {
  const router = useRouter();
  const { signUp, isLoading, error: authError, clearError } = useAuthStore();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  const onSubmit = useCallback(
    async (data: RegistrationFormData) => {
      clearError();
      const result = await signUp(data.email, data.password);

      if (result.success) {
        // Check if email confirmation is required (no immediate session)
        setShowSuccessMessage(true);
        // Navigate to onboarding after a short delay
        setTimeout(() => {
          router.replace('/onboarding/step1');
        }, 1500);
      }
    },
    [signUp, clearError, router]
  );

  // Handle navigation to login
  const handleGoToLogin = useCallback(() => {
    router.push('/auth/login');
  }, [router]);

  // Success message after registration
  if (showSuccessMessage) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-neutral-900">
        <Card variant="elevated" padding="lg" className="w-full max-w-sm items-center">
          <Text variant="heading-2" className="mb-4 text-center">
            ✅ Registrierung erfolgreich!
          </Text>
          <Text variant="body-md" color="secondary" className="text-center">
            Du wirst weitergeleitet...
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-white dark:bg-neutral-900"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-8 items-center">
            <Text variant="heading-1" className="mb-2 text-center">
              Konto erstellen
            </Text>
            <Text variant="body-md" color="secondary" className="text-center">
              Starte deine Reise zu einem gesünderen Leben
            </Text>
          </View>

          {/* Form */}
          <Card variant="outlined" padding="lg" className="mb-6">
            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-Mail"
                  type="email"
                  placeholder="deine@email.de"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  autoComplete="email"
                  containerClassName="mb-4"
                />
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Passwort"
                  type="password"
                  placeholder="Mindestens 8 Zeichen"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  autoComplete="new-password"
                  containerClassName="mb-4"
                />
              )}
            />

            {/* Confirm Password Input */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Passwort bestätigen"
                  type="password"
                  placeholder="Passwort wiederholen"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                  containerClassName="mb-6"
                />
              )}
            />

            {/* Auth Error */}
            {authError && (
              <View className="dark:bg-error-950 mb-4 rounded-lg bg-error-50 p-3">
                <Text variant="body-sm" className="text-error-700 dark:text-error-300">
                  {authError}
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              Registrieren
            </Button>
          </Card>

          {/* Login Link */}
          <View className="flex-row items-center justify-center">
            <Text variant="body-md" color="secondary">
              Bereits ein Konto?{' '}
            </Text>
            <Button variant="ghost" size="sm" onPress={handleGoToLogin}>
              Anmelden
            </Button>
          </View>

          {/* Password Requirements Info */}
          <View className="mt-6 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
            <Text variant="body-sm" className="mb-2 font-medium">
              Passwort-Anforderungen:
            </Text>
            <Text variant="body-sm" color="secondary">
              • Mindestens 8 Zeichen{'\n'}• Mindestens eine Zahl
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

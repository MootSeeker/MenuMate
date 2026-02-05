import React from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@/features/auth/utils/zodResolver';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { useAuthStore } from '@/features/auth';

// Zod-Validierungsschema für Login
const loginSchema = z.object({
  email: z.string().min(1, 'E-Mail ist erforderlich').email('Bitte eine gültige E-Mail eingeben'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * LoginScreen - Anmeldebildschirm mit E-Mail/Passwort-Formular
 *
 * Features:
 * - Formular-Validierung mit React Hook Form + Zod
 * - Keyboard-Aware ScrollView
 * - Navigation zu Registrierung
 * - Forgot-Password Platzhalter (Issue #12 später)
 *
 * @implements #10 Login Screen UI (3 SP)
 * @implements #11 Login Form Validation (2 SP)
 */
export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      // Navigation erfolgt automatisch durch Auth Guard in app/_layout.tsx
    } catch (error) {
      // Error Handling erfolgt im Store (Toast wird dort angezeigt)
      console.error('Login failed:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      className="flex-1 bg-white dark:bg-gray-900"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6 py-8">
          {/* Logo & Header */}
          <View className="mb-8 items-center">
            <Text className="mb-4 text-6xl">🍽️</Text>
            <Text variant="heading-1" className="mb-2">
              MenuMate
            </Text>
            <Text variant="body-md" className="text-gray-600 dark:text-gray-400">
              Willkommen zurück
            </Text>
          </View>

          {/* Login Form */}
          <View className="space-y-4">
            {/* E-Mail */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-Mail"
                  placeholder="deine@email.de"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={errors.email?.message}
                  testID="email-input"
                />
              )}
            />

            {/* Passwort */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Passwort"
                  placeholder="Dein Passwort"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  type="password"
                  autoCapitalize="none"
                  error={errors.password?.message}
                  testID="password-input"
                />
              )}
            />

            {/* Passwort vergessen - Platzhalter für Issue #12 */}
            <Text variant="body-sm" className="text-right text-gray-500 dark:text-gray-400">
              Passwort vergessen? (Demnächst verfügbar)
            </Text>

            {/* Login Button */}
            <Button
              variant="primary"
              size="lg"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              testID="login-button"
              className="mt-6"
            >
              {isSubmitting ? 'Anmeldung läuft...' : 'Anmelden'}
            </Button>

            {/* Register Link */}
            <View className="mt-6 flex-row items-center justify-center">
              <Text variant="body-md" className="text-gray-600 dark:text-gray-400">
                Noch kein Konto?{' '}
              </Text>
              <Button
                variant="ghost"
                size="md"
                onPress={() => router.push('/auth/register')}
                testID="register-link"
              >
                Jetzt registrieren
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

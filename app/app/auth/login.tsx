/**
 * Login Screen Route (Placeholder)
 *
 * Expo Router page for user login.
 * TODO: Implement login screen in Issue #10 [AUTH-002]
 */

import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, Button, Card } from '@/components/ui';

export default function Login() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-neutral-900">
      <Card variant="elevated" padding="lg" className="w-full max-w-sm">
        <Text variant="heading-2" className="mb-4 text-center">
          Anmelden
        </Text>
        <Text variant="body-md" color="secondary" className="mb-6 text-center">
          Login-Funktion wird in Issue #10 implementiert.
        </Text>

        <Button
          variant="primary"
          size="lg"
          onPress={() => router.push('/auth/register')}
          className="mb-4 w-full"
        >
          Zur Registrierung
        </Button>

        <Button
          variant="outline"
          size="lg"
          onPress={() => router.replace('/(tabs)')}
          className="w-full"
        >
          Überspringen (Dev)
        </Button>
      </Card>
    </View>
  );
}

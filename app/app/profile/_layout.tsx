/**
 * Profile Stack Layout
 *
 * Manages navigation within the profile section
 */

import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="edit-goals" />
    </Stack>
  );
}

/**
 * Journal Stack Layout
 *
 * Definiert die Navigation für Journal-bezogene Screens
 */

import { Stack } from 'expo-router';

export default function JournalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="search"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}

/**
 * Edit Goals Route
 *
 * Route: /profile/edit-goals
 * Allows users to edit their calorie and macro goals
 */

import { Stack } from 'expo-router';
import { EditGoalsScreen } from '@/features/user';

export default function EditGoalsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <EditGoalsScreen />
    </>
  );
}

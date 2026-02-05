/**
 * Profile Screen
 *
 * Displays user profile information, goals, gamification stats,
 * and provides access to settings.
 *
 * @see Issue #23 - [PROFILE-001] Profile Screen UI
 */

import { useCallback, useState } from 'react';
import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, Card, Button, Badge, ProgressBar, Divider } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useOnboardingStore } from '@/features/onboarding';

// ============================================
// TYPES
// ============================================

interface ProfileSection {
  title: string;
  children: React.ReactNode;
}

// ============================================
// HELPERS
// ============================================

/**
 * Get user initials from email
 */
function getInitials(email: string | undefined): string {
  if (!email) return '?';
  const parts = email.split('@')[0].split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return email.substring(0, 2).toUpperCase();
}

/**
 * Get goal label in German
 */
function getGoalLabel(goal: string | null): string {
  switch (goal) {
    case 'lose':
      return 'Abnehmen';
    case 'maintain':
      return 'Gewicht halten';
    case 'gain':
      return 'Aufbauen';
    default:
      return 'Nicht gesetzt';
  }
}

/**
 * Get activity level label in German
 */
function getActivityLabel(level: string | null): string {
  switch (level) {
    case 'sedentary':
      return 'Kaum aktiv';
    case 'lightly_active':
      return 'Leicht aktiv';
    case 'moderately_active':
      return 'Moderat aktiv';
    case 'very_active':
      return 'Sehr aktiv';
    case 'extremely_active':
      return 'Extrem aktiv';
    default:
      return 'Nicht gesetzt';
  }
}

// ============================================
// SUB-COMPONENTS
// ============================================

function ProfileSectionCard({ title, children }: ProfileSection) {
  return (
    <Card variant="outlined" padding="md" className="mb-4">
      <Text variant="label" className="mb-3">
        {title}
      </Text>
      {children}
    </Card>
  );
}

interface StatItemProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
}

function StatItem({ icon, label, value, unit }: StatItemProps) {
  return (
    <View className="flex-1 items-center">
      <Text className="mb-1 text-2xl">{icon}</Text>
      <Text variant="heading-3" className="mb-0.5">
        {value}
        {unit && <Text variant="body-sm" color="secondary">{` ${unit}`}</Text>}
      </Text>
      <Text variant="body-sm" color="secondary">
        {label}
      </Text>
    </View>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, isLoading: authLoading } = useAuthStore();
  const { data: onboardingData } = useOnboardingStore();

  const [refreshing, setRefreshing] = useState(false);

  // Mock gamification data (will be replaced with real data later)
  const [gamificationData] = useState({
    level: 5,
    points: 1250,
    pointsToNextLevel: 2000,
    currentStreak: 7,
    longestStreak: 14,
  });

  // Calculate level progress
  const levelProgress = gamificationData.points / gamificationData.pointsToNextLevel;

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: Fetch latest profile data from Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    Alert.alert('Abmelden', 'Möchtest du dich wirklich abmelden?', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Abmelden',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          // Navigation happens automatically via Auth Guard
        },
      },
    ]);
  }, [signOut]);

  // Handle edit goals navigation
  const handleEditGoals = useCallback(() => {
    router.push('/profile/edit-goals');
  }, [router]);

  // Handle settings navigation
  const handleSettings = useCallback(() => {
    // TODO: Navigate to settings screen
    Alert.alert('Info', 'Einstellungen werden in einem späteren Update hinzugefügt.');
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6 items-center py-6">
          {/* Avatar */}
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <Text className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {getInitials(user?.email)}
            </Text>
          </View>

          {/* Email */}
          <Text variant="heading-3" className="mb-1">
            {user?.email ?? 'Gast'}
          </Text>

          {/* Goal Badge */}
          {onboardingData.goal && (
            <Badge variant="primary" size="md">
              🎯 {getGoalLabel(onboardingData.goal)}
            </Badge>
          )}
        </View>

        {/* Gamification Section */}
        <ProfileSectionCard title="🏆 Dein Fortschritt">
          {/* Level Progress */}
          <View className="mb-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text variant="body-md" className="font-medium">
                Level {gamificationData.level}
              </Text>
              <Text variant="body-sm" color="secondary">
                {gamificationData.points} / {gamificationData.pointsToNextLevel} Punkte
              </Text>
            </View>
            <ProgressBar value={levelProgress} variant="primary" size="md" />
          </View>

          {/* Stats Row */}
          <View className="flex-row">
            <StatItem icon="🔥" label="Streak" value={gamificationData.currentStreak} unit="Tage" />
            <StatItem icon="⭐" label="Punkte" value={gamificationData.points} />
            <StatItem
              icon="🏅"
              label="Längster Streak"
              value={gamificationData.longestStreak}
              unit="Tage"
            />
          </View>
        </ProfileSectionCard>

        {/* Goals Section */}
        <ProfileSectionCard title="🎯 Deine Ziele">
          <View className="gap-3">
            {/* Daily Calories */}
            <View className="flex-row items-center justify-between">
              <Text variant="body-md">Tägliches Kalorienziel</Text>
              <Text variant="body-md" className="font-semibold">
                {onboardingData.dailyCalorieGoal ?? '—'} kcal
              </Text>
            </View>

            <Divider />

            {/* TDEE */}
            <View className="flex-row items-center justify-between">
              <Text variant="body-md">Kalorienbedarf (TDEE)</Text>
              <Text variant="body-md" className="font-semibold">
                {onboardingData.calculatedTDEE ?? '—'} kcal
              </Text>
            </View>

            <Divider />

            {/* Activity Level */}
            <View className="flex-row items-center justify-between">
              <Text variant="body-md">Aktivitätslevel</Text>
              <Text variant="body-md" className="font-semibold">
                {getActivityLabel(onboardingData.activityLevel)}
              </Text>
            </View>
          </View>

          {/* Edit Button */}
          <Button variant="outline" size="md" onPress={handleEditGoals} className="mt-4">
            Ziele bearbeiten
          </Button>
        </ProfileSectionCard>

        {/* Body Data Section */}
        <ProfileSectionCard title="📊 Körperdaten">
          <View className="flex-row gap-4">
            <StatItem icon="📏" label="Größe" value={onboardingData.heightCm ?? '—'} unit="cm" />
            <StatItem icon="⚖️" label="Gewicht" value={onboardingData.weightKg ?? '—'} unit="kg" />
          </View>
        </ProfileSectionCard>

        {/* Actions */}
        <View className="gap-3">
          <Button variant="outline" size="lg" onPress={handleSettings}>
            ⚙️ Einstellungen
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onPress={handleLogout}
            loading={authLoading}
            className="text-error-600"
          >
            Abmelden
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

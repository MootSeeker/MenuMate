import { View, Text, Pressable } from 'react-native';

/**
 * Test component to verify NativeWind (Tailwind CSS) configuration.
 * This component demonstrates various Tailwind utility classes working in React Native.
 */
export function NativeWindTest() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4 dark:bg-gray-900">
      {/* Card Container */}
      <View className="w-full max-w-sm rounded-2xl bg-blue-500 p-6 shadow-lg">
        <Text className="mb-2 text-center text-2xl font-bold text-white">NativeWind Test</Text>
        <Text className="mb-4 text-center text-blue-100">
          Tailwind CSS is working in React Native! 🎉
        </Text>

        {/* Flex Row Example */}
        <View className="mb-4 flex-row justify-between">
          <View className="h-12 w-12 rounded-full bg-blue-400" />
          <View className="h-12 w-12 rounded-lg bg-blue-300" />
          <View className="h-12 w-12 rounded-md bg-blue-200" />
        </View>

        {/* Button Example */}
        <Pressable className="rounded-lg bg-white px-4 py-3 active:bg-gray-100">
          <Text className="text-center font-semibold text-blue-500">Press Me</Text>
        </Pressable>
      </View>

      {/* Dark Mode Indicator */}
      <View className="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <Text className="text-gray-700 dark:text-gray-300">Dark mode classes are configured ✓</Text>
      </View>

      {/* Spacing & Typography Examples */}
      <View className="mt-6 space-y-2">
        <Text className="text-xs text-gray-500">Extra Small Text</Text>
        <Text className="text-sm text-gray-600">Small Text</Text>
        <Text className="text-base text-gray-700">Base Text</Text>
        <Text className="text-lg font-medium text-gray-800">Large Medium</Text>
        <Text className="text-xl font-bold text-gray-900">Extra Large Bold</Text>
      </View>
    </View>
  );
}

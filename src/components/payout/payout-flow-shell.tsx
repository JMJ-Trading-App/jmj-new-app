import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';

type PayoutFlowShellProps = {
  title: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
  loading?: boolean;
};

export function PayoutFlowShell({
  title,
  children,
  onSubmit,
  submitDisabled = false,
  submitLabel = 'Continue',
  loading = false,
}: PayoutFlowShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-2 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            {title}
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow gap-6 px-5 pb-6 pt-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>

        <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          <Button
            disabled={submitDisabled}
            label={submitLabel}
            loading={loading}
            onPress={onSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

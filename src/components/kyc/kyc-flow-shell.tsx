import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KycStepProgress } from '@/components/kyc/kyc-step-progress';
import { Button } from '@/components/ui/button';
import { KYC_FLOW_STEPS } from '@/constants/kyc-data';

type KycFlowShellProps = {
  title: string;
  step: number;
  children: ReactNode;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  footer?: ReactNode;
};

export function KycFlowShell({
  title,
  step,
  children,
  onNext,
  nextDisabled = false,
  nextLabel = 'Continue',
  footer,
}: KycFlowShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View className="gap-5 px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center">
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

        <KycStepProgress step={step} total={KYC_FLOW_STEPS} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-5 pt-6 pb-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        {footer ?? (
          <Button disabled={nextDisabled} label={nextLabel} onPress={onNext} />
        )}
      </View>
    </View>
  );
}

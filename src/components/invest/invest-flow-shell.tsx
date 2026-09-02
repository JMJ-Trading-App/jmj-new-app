import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InvestStepProgress } from '@/components/invest/invest-step-progress';
import { Button } from '@/components/ui/button';
import { INVEST_FLOW_STEPS } from '@/constants/invest-flow-data';

type InvestFlowShellProps = {
  title: string;
  step: number;
  children: ReactNode;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  footerExtra?: ReactNode;
};

export function InvestFlowShell({
  title,
  step,
  children,
  onNext,
  nextDisabled = false,
  nextLabel = 'Next',
  footerExtra,
}: InvestFlowShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-4 flex-row items-center">
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

        <InvestStepProgress step={step} total={INVEST_FLOW_STEPS} />
      </View>

      {children}

      <View className="gap-4 px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        {footerExtra}
        <Button disabled={nextDisabled} label={nextLabel} onPress={onNext} />
      </View>
    </View>
  );
}

import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { InvestFlowShell } from '@/components/invest/invest-flow-shell';
import { PaymentSummaryCard } from '@/components/invest/payment-summary-card';
import { ProjectedReturnsCard } from '@/components/invest/projected-returns-card';
import {
  DEFAULT_DEPOSIT,
  DEPOSIT_PRESETS,
  formatUsd,
  formatUsdParts,
  MIN_DEPOSIT,
} from '@/constants/invest-flow-data';
import { cn } from '@/lib/cn';

export default function DepositReturnsScreen() {
  const [deposit, setDeposit] = useState(DEFAULT_DEPOSIT);
  const [expanded, setExpanded] = useState(false);
  const amountParts = useMemo(() => formatUsdParts(deposit), [deposit]);

  return (
    <InvestFlowShell
      title="Deposit & Returns"
      step={3}
      onNext={() => router.push('/invest/payment' as Href)}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-6 pt-6"
        showsVerticalScrollIndicator={false}>
        <View className="items-center gap-2">
          <View className="flex-row items-end">
            <Text className="font-geist-bold text-[40px] leading-[48px] text-stone-title">
              {amountParts.whole}
            </Text>
            <Text className="mb-1.5 font-geist-bold text-[28px] leading-[34px] text-[#A8A29E]">
              {amountParts.cents}
            </Text>
          </View>
          <Text className="font-geist text-[13px] text-muted">
            Minimum investment: {formatUsd(MIN_DEPOSIT, 0)}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {DEPOSIT_PRESETS.map((preset) => {
            const selected = deposit === preset;
            return (
              <Pressable
                key={preset}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setDeposit(preset)}
                className={cn(
                  'min-w-[72px] flex-1 items-center rounded-[14px] px-3 py-3',
                  selected ? 'border border-[#E8C84A] bg-[#FBF6E4]' : 'bg-[#F3F4F6]',
                )}
                style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
                <Text
                  className={cn(
                    'font-geist-semibold text-[14px]',
                    selected ? 'text-[#8A6D10]' : 'text-stone-title',
                  )}>
                  {formatUsd(preset, 0)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ProjectedReturnsCard
          deposit={deposit}
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
        />

        <PaymentSummaryCard deposit={deposit} />
      </ScrollView>
    </InvestFlowShell>
  );
}

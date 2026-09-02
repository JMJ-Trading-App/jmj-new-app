import { router, useLocalSearchParams, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PercentBadgeIcon } from '@/components/invest/invest-flow-icons';
import { Button } from '@/components/ui/button';
import { formatUsd, formatUsdParts } from '@/constants/invest-flow-data';
import {
  getPoolById,
  getPoolJoinProjection,
  parsePoolSize,
} from '@/constants/pool-data';
import { cn } from '@/lib/cn';

export default function JoinPoolScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pool = getPoolById(id ?? 'alpha-growth');
  const [accepted, setAccepted] = useState(false);

  const projection = useMemo(() => {
    if (!pool) return null;
    return getPoolJoinProjection(pool.minContributionValue, parsePoolSize(pool.poolSize));
  }, [pool]);

  if (!pool || !projection) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5">
        <Text className="font-geist-bold text-base text-stone-title">Pool not found</Text>
        <Pressable className="mt-4" onPress={() => router.back()}>
          <Text className="font-geist-medium text-muted">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const amountParts = formatUsdParts(projection.contribution);
  const shareLabel = `~${Math.round(projection.sharePercent)}%`;

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
            Join Pool
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-6 pt-4"
        showsVerticalScrollIndicator={false}>
        <View className="items-center">
          <View className="flex-row items-end">
            <Text className="font-geist-bold text-[40px] leading-[48px] text-stone-title">
              {amountParts.whole}
            </Text>
            <Text className="mb-1.5 font-geist-bold text-[28px] leading-[34px] text-[#A8A29E]">
              {amountParts.cents}
            </Text>
          </View>
        </View>

        <View className="rounded-[18px] border border-[#E5E7EB] bg-white p-4">
          <Text className="font-geist-bold text-[16px] text-stone-title">Payment Summary</Text>

          <View className="mt-4 gap-3">
            <SummaryRow label="Contribution Amount" value={formatUsd(projection.contribution)} />

            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1 flex-row flex-wrap items-center gap-2">
                <Text className="font-geist text-[14px] text-stone-body">Service Charge</Text>
                <View className="rounded-full bg-[#F5E8B0] px-2 py-0.5">
                  <Text className="font-geist-semibold text-[10px] tracking-wide text-[#8A6D10]">
                    3.5%
                  </Text>
                </View>
              </View>
              <Text className="font-geist-semibold text-[14px] text-stone-title">
                {formatUsd(projection.serviceCharge)}
              </Text>
            </View>
          </View>

          <View className="my-4 h-px bg-[#EFEFEF]" />

          <View className="flex-row items-center justify-between gap-3">
            <Text className="font-geist-bold text-[15px] text-[#C4A015]">Total to Pay</Text>
            <Text className="font-geist-bold text-[16px] text-[#C4A015]">
              {formatUsd(projection.totalToPay)}
            </Text>
          </View>

          <View className="my-4 h-px bg-[#EFEFEF]" />

          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1 flex-row flex-wrap items-center gap-2">
              <Text className="font-geist text-[14px] text-stone-body">Expected Profit</Text>
              <View className="rounded-full bg-[#DCFCE7] px-2 py-0.5">
                <Text className="font-geist-semibold text-[10px] tracking-wide text-[#166534]">
                  Est.
                </Text>
              </View>
            </View>
            <Text className="font-geist-bold text-[16px] text-success">
              {formatUsd(projection.expectedProfit)}
            </Text>
          </View>

          <Text className="mt-3 font-geist text-[12px] leading-[17px] text-muted">
            Based on 55/45 split · past performance doesn't guarantee results
          </Text>
        </View>

        <View className="flex-row items-center gap-3 rounded-[16px] bg-[#F3F4F6] px-4 py-3.5">
          <PercentBadgeIcon size={20} />
          <Text className="flex-1 font-geist text-[13px] leading-[18px] text-stone-body">
            Your Share: {shareLabel} of pool based on current raised
          </Text>
        </View>
      </ScrollView>

      <View className="gap-4 px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
          onPress={() => setAccepted((current) => !current)}
          className="flex-row items-start gap-3"
          hitSlop={4}>
          <View
            className={cn(
              'mt-0.5 h-5 w-5 items-center justify-center rounded-[5px] border',
              accepted ? 'border-[#8A6D10] bg-[#8A6D10]' : 'border-[#D1D5DB] bg-white',
            )}>
            {accepted ? <Text className="font-geist-bold text-[11px] text-white">✓</Text> : null}
          </View>
          <Text className="flex-1 font-geist text-[14px] leading-[20px] text-stone-title">
            I have read and accept the{' '}
            <Text className="underline">Privacy Policy</Text> and{' '}
            <Text className="underline">Terms and Conditions</Text>
          </Text>
        </Pressable>

        <Button
          disabled={!accepted}
          label="Next"
          onPress={() => router.push(`/pool/payout/${pool.id}` as Href)}
        />
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text className="font-geist text-[14px] text-stone-body">{label}</Text>
      <Text className="font-geist-semibold text-[14px] text-stone-title">{value}</Text>
    </View>
  );
}

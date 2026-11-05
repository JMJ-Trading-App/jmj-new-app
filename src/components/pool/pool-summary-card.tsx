import { Text, View } from 'react-native';

import type { PoolSummary } from '@/constants/pool-data';
import { cn } from '@/lib/cn';

type PoolSummaryCardProps = {
  summary: PoolSummary;
};

export function PoolSummaryCard({ summary }: PoolSummaryCardProps) {
  return (
    <View
      className="rounded-[24px] border border-[#EFEFEF] bg-[#FFF8E9] p-5"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.03,
        shadowRadius: 24,
        elevation: 4,
      }}>
      <Text className="font-geist text-[13px] text-muted">Total Pool Contributions</Text>

      <View className="mt-2 flex-row items-end">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          className="font-geist-bold text-[32px] leading-[38px] text-stone-title">
          {summary.totalWhole}
        </Text>
        <Text className="mb-1 font-geist-bold text-[28px] leading-[34px] text-[#A8A29E]">
          {summary.totalCents}
        </Text>
      </View>

      <View className="my-5 h-px bg-[#E8D9A8]" />

      <View className="flex-row">
        <View className="flex-1 gap-1">
          <Text className="font-geist text-[13px] text-muted">Contributed</Text>
          <Text className="font-geist-bold text-[18px] text-stone-title">{summary.contributed}</Text>
        </View>

        <View className="flex-1 gap-1">
          <Text className="font-geist text-[13px] text-muted">Earnings</Text>
          <Text
            className={cn(
              'font-geist-bold text-[18px]',
              summary.earningsPositive ? 'text-success' : 'text-error',
            )}>
            {summary.earnings}
          </Text>
        </View>
      </View>
    </View>
  );
}

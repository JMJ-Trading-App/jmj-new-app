import { Pressable, Text, View } from 'react-native';

import { TrendIcon } from '@/components/home/home-icons';
import { ArrowRightIcon } from '@/components/invest/invest-icons';
import type { PortfolioSummary } from '@/constants/invest-data';
import { cn } from '@/lib/cn';

type PortfolioSummaryCardProps = {
  portfolio: PortfolioSummary;
  onStartInvesting?: () => void;
};

export function PortfolioSummaryCard({ portfolio, onStartInvesting }: PortfolioSummaryCardProps) {
  return (
    <View
      className="rounded-[24px] border border-[#F0F0F0] bg-white p-5"
      style={{
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 3,
      }}>
      <Text className="font-geist text-[13px] text-muted">Total Portfolio Value</Text>

      <View className="mt-2 flex-row items-end">
        <Text className="font-geist-bold text-[36px] leading-[42px] text-stone-title">
          {portfolio.totalValueWhole}
        </Text>
        <Text className="mb-1 font-geist-bold text-[28px] leading-[34px] text-[#A8A29E]">
          {portfolio.totalValueCents}
        </Text>
      </View>

      {portfolio.monthlyChange ? (
        <View
          className={cn(
            'mt-3 self-start flex-row items-center gap-1.5 rounded-full px-2.5 py-1.5',
            portfolio.monthlyPositive === false ? 'bg-[#FEE2E2]' : 'bg-[#DCFCE7]',
          )}>
          <TrendIcon color={portfolio.monthlyPositive === false ? '#991B1B' : '#166534'} />
          <Text
            className={cn(
              'font-geist-medium text-[12px]',
              portfolio.monthlyPositive === false ? 'text-[#991B1B]' : 'text-[#166534]',
            )}>
            {portfolio.monthlyChange}
          </Text>
        </View>
      ) : null}

      <View className="my-5 h-px bg-[#EFEFEF]" />

      <View className="flex-row">
        <View className="flex-1 gap-1">
          <Text className="font-geist text-[13px] text-muted">Invested</Text>
          <Text className="font-geist-bold text-[18px] text-stone-title">{portfolio.invested}</Text>
        </View>

        <View className="flex-1 gap-1">
          <Text className="font-geist text-[13px] text-muted">Returns</Text>
          <Text
            className={cn(
              'font-geist-bold text-[18px]',
              portfolio.returnsPositive ? 'text-success' : 'text-error',
            )}>
            {portfolio.returns}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start Investing"
        onPress={onStartInvesting}
        className="mt-5 flex-row items-center justify-center gap-2 rounded-[14px] bg-stone-title py-[16px]"
        style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
        <Text className="font-geist-semibold text-[16px] text-white">Start Investing</Text>
        <ArrowRightIcon />
      </Pressable>
    </View>
  );
}

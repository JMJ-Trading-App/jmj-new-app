import { Text, View } from 'react-native';

import { PercentBadgeIcon } from '@/components/invest/invest-flow-icons';
import { PROFIT_SPLIT } from '@/constants/invest-flow-data';

export function ProfitSplitCard() {
  return (
    <View className="rounded-[18px] border border-[#E7E5E4] bg-[#FAFAF9] p-4">
      <View className="flex-row items-center gap-2">
        <PercentBadgeIcon />
        <Text className="font-geist-bold text-[15px] text-[#C4A015]">{PROFIT_SPLIT.title}</Text>
      </View>

      <Text className="mt-3 font-geist text-[14px] leading-[20px] text-stone-body">
        {PROFIT_SPLIT.description}
      </Text>

      <View className="my-4 h-px bg-[#E7E5E4]" />

      <View className="flex-row">
        <View className="flex-1 gap-1">
          <Text className="font-geist-medium text-[11px] tracking-wide text-muted">YOUR SHARE</Text>
          <Text className="font-geist-bold text-[28px] text-[#C4A015]">{PROFIT_SPLIT.yourShare}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="font-geist-medium text-[11px] tracking-wide text-muted">JMJ FEE</Text>
          <Text className="font-geist-bold text-[28px] text-stone-title">{PROFIT_SPLIT.jmjFee}</Text>
        </View>
      </View>

      <Text className="mt-3 font-geist text-[13px] leading-[18px] text-stone-title">
        {PROFIT_SPLIT.note}
      </Text>
    </View>
  );
}

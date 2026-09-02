import { Pressable, Text, View } from 'react-native';

import { RankBadgeIcon } from '@/components/home/home-icons';
import { MORE_PLAN_BADGE } from '@/constants/more-data';

export function MoreHeader() {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-geist-bold text-[28px] leading-[34px] text-stone-title">More</Text>

      <View className="flex-row items-center gap-1.5 rounded-full bg-[#F5E8B0] px-2.5 py-1.5">
        <RankBadgeIcon size={14} tier={MORE_PLAN_BADGE.tier} />
        <Text className="font-geist-semibold text-[12px] text-[#8A6D10]">{MORE_PLAN_BADGE.label}</Text>
      </View>
    </View>
  );
}

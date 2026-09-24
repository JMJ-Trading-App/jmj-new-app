import { Pressable, Text, View } from 'react-native';

import { RankBadgeIcon, type RankTier } from '@/components/home/home-icons';
import { MORE_PLAN_BADGE } from '@/constants/more-data';

type MoreHeaderProps = {
  planLabel?: string | null;
  planTier?: string | null;
};

function asRankTier(tier?: string | null): RankTier {
  if (tier === 'pro' || tier === 'vip' || tier === 'basic') return tier;
  return MORE_PLAN_BADGE.tier;
}

export function MoreHeader({ planLabel, planTier }: MoreHeaderProps = {}) {
  const label = planLabel ?? MORE_PLAN_BADGE.label;
  const tier = asRankTier(planTier);

  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-geist-bold text-[28px] leading-[34px] text-stone-title">More</Text>

      <View className="flex-row items-center gap-1.5 rounded-full bg-[#F5E8B0] px-2.5 py-1.5">
        <RankBadgeIcon size={14} tier={tier} />
        <Text className="font-geist-semibold text-[12px] text-[#8A6D10]">{label}</Text>
      </View>
    </View>
  );
}

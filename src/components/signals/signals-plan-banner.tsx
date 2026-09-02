import { Pressable, Text, View } from 'react-native';

import { SIGNALS_PLAN } from '@/constants/signals-data';

type SignalsPlanBannerProps = {
  onManage?: () => void;
};

export function SignalsPlanBanner({ onManage }: SignalsPlanBannerProps) {
  return (
    <View className="flex-row items-center gap-3 rounded-[16px] border border-[#E8C84A] bg-[#FFF8E9] px-4 py-3.5">
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="font-geist-bold text-[15px] text-stone-title">{SIGNALS_PLAN.name}</Text>
        <Text className="font-geist text-[13px] text-muted">{SIGNALS_PLAN.summary}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Manage plan"
        onPress={onManage}
        hitSlop={8}
        style={({ pressed }) => [pressed && { opacity: 0.75 }]}>
        <Text className="font-geist-bold text-[14px] text-[#C4A015]">{SIGNALS_PLAN.manageLabel}</Text>
      </Pressable>
    </View>
  );
}

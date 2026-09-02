import { Pressable, Text, View } from 'react-native';

import { AccessEndedBadge } from '@/components/signals/signals-icons';
import { SIGNALS_ENDED } from '@/constants/signals-data';

type SignalsAccessEndedProps = {
  onSeePlans?: () => void;
};

export function SignalsAccessEnded({ onSeePlans }: SignalsAccessEndedProps) {
  return (
    <View className="items-center gap-4 px-2 pt-2">
      <AccessEndedBadge />

      <View className="items-center gap-2">
        <Text className="text-center font-geist-bold text-[22px] leading-[28px] text-stone-title">
          {SIGNALS_ENDED.title}
        </Text>
        <Text className="text-center font-geist text-[14px] leading-[20px] text-stone-body">
          {SIGNALS_ENDED.subtitle}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={SIGNALS_ENDED.cta}
        onPress={onSeePlans}
        className="rounded-[12px] bg-brand-tint px-6 py-3"
        style={({ pressed }) => [pressed && { opacity: 0.88 }]}>
        <Text className="font-geist-bold text-[14px] text-stone-title">{SIGNALS_ENDED.cta}</Text>
      </Pressable>
    </View>
  );
}

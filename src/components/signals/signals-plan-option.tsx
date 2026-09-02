import { Pressable, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import type { SubscriptionPlan } from '@/constants/subscriptions-data';
import { cn } from '@/lib/cn';

function PlanRadio({ selected }: { selected: boolean }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Circle
        cx={11}
        cy={11}
        r={9}
        stroke={selected ? '#1C1917' : '#D1D5DB'}
        strokeWidth={1.6}
      />
      {selected ? <Circle cx={11} cy={11} r={5} fill="#1C1917" /> : null}
    </Svg>
  );
}

type SignalsPlanOptionProps = {
  plan: SubscriptionPlan;
  selected: boolean;
  onPress: () => void;
};

export function SignalsPlanOption({ plan, selected, onPress }: SignalsPlanOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'relative rounded-[16px] border px-4 py-4',
        selected ? 'border-stone-title bg-[#FFF8E9]' : 'border-[#E5E7EB] bg-white',
      )}
      style={({ pressed }) => [pressed && { opacity: 0.94 }]}>
      {plan.popular ? (
        <View className="absolute -top-2.5 right-3 rounded-md bg-[#166534] px-2 py-0.5">
          <Text className="font-geist-bold text-[9px] tracking-wide text-white">MOST POPULAR</Text>
        </View>
      ) : null}

      <View className="flex-row items-center gap-3">
        <PlanRadio selected={selected} />

        <Text className="min-w-0 flex-1 font-geist-bold text-[15px] text-stone-title">
          {plan.name} <Text className="font-geist text-[14px] text-muted">{plan.duration}</Text>
        </Text>

        <Text className="font-geist-bold text-[15px] text-stone-title">{plan.price}</Text>
      </View>
    </Pressable>
  );
}

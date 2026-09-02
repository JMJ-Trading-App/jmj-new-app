import { Pressable, Text, View } from 'react-native';

import { RankBadgeIcon } from '@/components/home/home-icons';
import { RadioCheckIcon } from '@/components/invest/invest-flow-icons';
import type { SubscriptionPlan } from '@/constants/subscriptions-data';
import { cn } from '@/lib/cn';

type SubscriptionPlanCardProps = {
  plan: SubscriptionPlan;
  selected: boolean;
  onPress: () => void;
};

export function SubscriptionPlanCard({ plan, selected, onPress }: SubscriptionPlanCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'rounded-[20px] border bg-white px-4 py-4',
        selected ? 'border-[#E8C84A] bg-[#FFFEF8]' : 'border-[#E5E7EB]',
      )}
      style={({ pressed }) => [pressed && { opacity: 0.94 }]}>
      <View className="flex-row items-start gap-3">
        <View className="mt-0.5">
          <RankBadgeIcon size={36} tier={plan.badgeTier} />
        </View>

        <View className="min-w-0 flex-1 gap-2">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1 gap-1">
              <Text className="font-geist-bold text-[16px] text-stone-title">
                {plan.name}{' '}
                <Text className="font-geist text-[14px] text-muted">{plan.duration}</Text>
              </Text>
              <Text className="font-geist-bold text-[22px] leading-[28px] text-stone-title">
                {plan.price}
              </Text>
            </View>

            <RadioCheckIcon selected={selected} />
          </View>

          <View className="gap-1 pt-1">
            {plan.features.map((feature) => (
              <Text key={feature} className="font-geist text-[13px] leading-[18px] text-muted">
                • {feature}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

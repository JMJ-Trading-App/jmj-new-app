import { Pressable, Text, View } from 'react-native';

import {
  ChevronRightSmallIcon,
  RiskChartIcon,
} from '@/components/invest/invest-flow-icons';
import type { RiskLevelOption } from '@/constants/invest-flow-data';
import { cn } from '@/lib/cn';

type RiskLevelCardProps = {
  option: RiskLevelOption;
  selected: boolean;
  onPress: () => void;
  onContactPress?: () => void;
};

export function RiskLevelCard({
  option,
  selected,
  onPress,
  onContactPress,
}: RiskLevelCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'flex-row items-start gap-3 rounded-[18px] px-4 py-4',
        selected ? 'border border-foreground bg-[#F8F1E3]' : 'border border-transparent bg-[#F3F4F6]',
      )}
      style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
      <RiskChartIcon active={selected} />

      <View className="min-w-0 flex-1 gap-1">
        <Text
          className={cn(
            'font-geist-bold text-[16px]',
            selected ? 'text-stone-title' : 'text-[#78716C]',
          )}>
          {option.label}
        </Text>
        <Text
          className={cn(
            'font-geist text-[13px] leading-[18px]',
            selected ? 'text-stone-body' : 'text-[#A8A29E]',
          )}>
          {option.description}
        </Text>

        {option.showContact && selected ? (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Contact us"
            onPress={(event) => {
              event.stopPropagation?.();
              onContactPress?.();
            }}
            className="mt-1 flex-row items-center gap-1 self-start"
            hitSlop={8}>
            <Text className="font-geist-semibold text-[13px] text-stone-title">Contact us</Text>
            <ChevronRightSmallIcon />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

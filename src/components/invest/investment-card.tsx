import { Pressable, Text, View } from 'react-native';

import type { InvestmentItem, InvestmentStatus } from '@/constants/invest-data';
import { cn } from '@/lib/cn';

const STATUS_STYLES: Record<
  InvestmentStatus,
  { label: string; badge: string; text: string; progress: string }
> = {
  active: {
    label: 'Active',
    badge: 'bg-[#DCFCE7]',
    text: 'text-[#166534]',
    progress: 'bg-[#16A34A]',
  },
  pending: {
    label: 'Pending',
    badge: 'bg-[#FEF3C7]',
    text: 'text-[#92400E]',
    progress: 'bg-[#D97706]',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-[#F3F4F6]',
    text: 'text-[#57534E]',
    progress: 'bg-[#A8A29E]',
  },
};

type InvestmentCardProps = {
  item: InvestmentItem;
  onPress?: (item: InvestmentItem) => void;
};

export function InvestmentCard({ item, onPress }: InvestmentCardProps) {
  const status = STATUS_STYLES[item.status];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(item)}
      className="rounded-[20px] border border-[#EFEFEF] bg-white p-4"
      style={({ pressed }) => [pressed && { opacity: 0.92 }]}>
      <View className="flex-row items-start justify-between gap-3">
        <Text className="flex-1 font-geist-bold text-[16px] text-stone-title">{item.name}</Text>
        <View className={cn('rounded-full px-2.5 py-1', status.badge)}>
          <Text className={cn('font-geist-medium text-[12px]', status.text)}>{status.label}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row">
        <View className="flex-1 gap-1">
          <Text className="font-geist text-[12px] text-muted">Invested</Text>
          <Text className="font-geist-semibold text-[15px] text-stone-title">{item.invested}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="font-geist text-[12px] text-muted">{item.valueLabel}</Text>
          <Text className="font-geist-semibold text-[15px] text-stone-title">{item.value}</Text>
        </View>
      </View>

      <View className="mt-3 flex-row">
        <View className="flex-1 gap-1">
          <Text className="font-geist text-[12px] text-muted">Total Return</Text>
          <Text
            className={cn(
              'font-geist-semibold text-[15px]',
              item.returnPositive ? 'text-success' : 'text-error',
            )}>
            {item.totalReturn} ({item.totalReturnPercent})
          </Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="font-geist text-[12px] text-muted">Duration</Text>
          <Text className="font-geist-semibold text-[15px] text-stone-title">{item.duration}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <Text className="font-geist text-[12px] text-muted">Started: {item.started}</Text>
        <Text className="font-geist-medium text-[12px] text-stone-title">
          {item.progress}% completed
        </Text>
      </View>

      <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
        <View
          className={cn('h-full rounded-full', status.progress)}
          style={{ width: `${Math.min(Math.max(item.progress, 0), 100)}%` }}
        />
      </View>
    </Pressable>
  );
}

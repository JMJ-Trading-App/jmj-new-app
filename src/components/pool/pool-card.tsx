import { Pressable, Text, View } from 'react-native';

import type { PoolItem, PoolStatus } from '@/constants/pool-data';
import { cn } from '@/lib/cn';

const STATUS_STYLES: Record<PoolStatus, { label: string; badge: string; text: string }> = {
  active: {
    label: 'Active',
    badge: 'bg-[#DCFCE7]',
    text: 'text-[#166534]',
  },
  upcoming: {
    label: 'Upcoming',
    badge: 'bg-[#F5E8B0]',
    text: 'text-[#8A6D10]',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-[#F3F4F6]',
    text: 'text-[#57534E]',
  },
};

type PoolCardProps = {
  pool: PoolItem;
  onPress?: (pool: PoolItem) => void;
  onActionPress?: (pool: PoolItem) => void;
};

export function PoolCard({ pool, onPress, onActionPress }: PoolCardProps) {
  const status = STATUS_STYLES[pool.status];
  const isUpcoming = pool.status === 'upcoming';
  const isCompleted = pool.status === 'completed';
  const hasPosition = Boolean(pool.position);
  const showPositionMetrics = isCompleted || hasPosition;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(pool)}
      className="rounded-[20px] border border-[#EFEFEF] bg-white p-4"
      style={({ pressed }) => [pressed && { opacity: 0.94 }]}>
      <View className="flex-row items-start justify-between gap-3">
        <Text className="flex-1 font-geist-bold text-[16px] text-stone-title">{pool.name}</Text>
        <View className={cn('rounded-full px-2.5 py-1', status.badge)}>
          <Text className={cn('font-geist-medium text-[12px]', status.text)}>{status.label}</Text>
        </View>
      </View>

      <Text className="mt-2 font-geist text-[13px] leading-[18px] text-stone-body">
        {pool.shortDescription}
      </Text>

      {isUpcoming && pool.opensIn ? (
        <View className="mt-3 self-start rounded-full bg-[#F5E8B0] px-2.5 py-1">
          <Text className="font-geist-medium text-[12px] text-[#8A6D10]">{pool.opensIn}</Text>
        </View>
      ) : (
        <View className="mt-4 gap-2">
          <View className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
            <View
              className={cn(
                'h-full rounded-full',
                isCompleted || hasPosition ? 'bg-success' : 'bg-[#C4A015]',
              )}
              style={{ width: `${Math.min(Math.max(pool.raisedProgress, 0), 100)}%` }}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="font-geist text-[12px] text-muted">{pool.raisedLabel}</Text>
            <Text
              className={cn(
                'font-geist-medium text-[12px]',
                isCompleted || hasPosition ? 'text-stone-title' : 'text-muted',
              )}>
              {pool.raisedProgress}%
            </Text>
          </View>
        </View>
      )}

      {showPositionMetrics ? (
        <View className="mt-4 flex-row gap-4">
          <View className="flex-1 gap-0.5">
            <Text className="font-geist text-[11px] text-muted">Return</Text>
            <Text className="font-geist-semibold text-[13px] text-success">
              {pool.returnLabel ?? pool.returns}
            </Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="font-geist text-[11px] text-muted">Your Earnings</Text>
            <Text className="font-geist-semibold text-[13px] text-success">
              {pool.yourEarnings ?? '—'}
            </Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="font-geist text-[11px] text-muted">Duration</Text>
            <Text className="font-geist-semibold text-[13px] text-stone-title">{pool.duration}</Text>
          </View>
        </View>
      ) : (
        <View className="mt-4 flex-row flex-wrap items-end justify-between gap-3">
          <View className="min-w-0 flex-1 flex-row flex-wrap gap-x-4 gap-y-2">
            <View className="gap-0.5">
              <Text className="font-geist text-[11px] text-muted">Duration</Text>
              <Text className="font-geist-semibold text-[13px] text-stone-title">{pool.duration}</Text>
            </View>
            <View className="gap-0.5">
              <Text className="font-geist text-[11px] text-muted">Min</Text>
              <Text className="font-geist-semibold text-[13px] text-stone-title">
                {pool.minContribution}
              </Text>
            </View>
            <View className="min-w-0 flex-1 gap-0.5">
              <Text className="font-geist text-[11px] text-muted">
                {isUpcoming ? 'Target' : 'Contributors'}
              </Text>
              <Text className="font-geist-semibold text-[13px] text-stone-title" numberOfLines={1}>
                {isUpcoming ? pool.targetLabel : pool.contributorsLabel}
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={pool.ctaLabel}
            onPress={(event) => {
              event.stopPropagation?.();
              onActionPress?.(pool);
            }}
            className="rounded-[12px] bg-stone-title px-3.5 py-2.5"
            style={({ pressed }) => [pressed && { opacity: 0.88 }]}>
            <Text className="font-geist-semibold text-[13px] text-white">{pool.ctaLabel}</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

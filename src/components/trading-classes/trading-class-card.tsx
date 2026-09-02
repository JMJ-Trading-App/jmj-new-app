import { Pressable, Text, View } from 'react-native';

import {
  ClockIcon,
  VideoCameraIcon,
} from '@/components/trading-classes/trading-classes-icons';
import type { ClassAction, TradingClass } from '@/constants/trading-classes-data';
import { cn } from '@/lib/cn';

type TradingClassCardProps = {
  item: TradingClass;
  action: ClassAction;
  onActionPress: () => void;
};

export function TradingClassCard({ item, action, onActionPress }: TradingClassCardProps) {
  const isLive = item.status === 'live';

  return (
    <View
      className="rounded-[20px] border border-[#EFEFEF] bg-white p-4"
      style={{
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
      }}>
      <View className="mb-2 flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-1.5">
          <VideoCameraIcon />
          <Text className="font-geist-medium text-[13px] text-stone-title" numberOfLines={1}>
            {item.platform}
          </Text>
        </View>

        <View
          className={cn(
            'rounded-full px-2.5 py-1',
            isLive ? 'bg-[#EF4444]' : 'bg-[#F5E8B0]',
          )}>
          <Text
            className={cn(
              'font-geist-semibold text-[11px]',
              isLive ? 'text-white' : 'text-[#8A6D10]',
            )}>
            {isLive ? 'Live Now' : 'Upcoming'}
          </Text>
        </View>
      </View>

      <Text className="mb-1 font-geist text-[13px] text-muted">{item.tier}</Text>
      <Text className="mb-2 font-geist-bold text-[17px] leading-[22px] text-stone-title">
        {item.title}
      </Text>
      <Text className="font-geist text-[13px] leading-[18px] text-stone-body">
        {item.description}
      </Text>

      <View className="mt-4 border-t border-[#F3F4F6] pt-3">
        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-1 flex-row items-center gap-1.5">
            <ClockIcon />
            <Text className="font-geist text-[12px] text-muted" numberOfLines={1}>
              {item.schedule}
            </Text>
          </View>

          <ClassActionButton action={action} onPress={onActionPress} />
        </View>
      </View>
    </View>
  );
}

function ClassActionButton({
  action,
  onPress,
}: {
  action: ClassAction;
  onPress: () => void;
}) {
  if (action === 'join') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Join Class"
        onPress={onPress}
        className="rounded-full bg-[#A16207] px-3.5 py-2"
        style={({ pressed }) => [pressed && { opacity: 0.88 }]}>
        <Text className="font-geist-semibold text-[12px] text-white">Join Class</Text>
      </Pressable>
    );
  }

  if (action === 'reminded') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reminder Set"
        onPress={onPress}
        className="rounded-full border border-[#86EFAC] bg-[#DCFCE7] px-3.5 py-2"
        style={({ pressed }) => [pressed && { opacity: 0.88 }]}>
        <Text className="font-geist-semibold text-[12px] text-[#166534]">Reminder Set</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Set Reminder"
      onPress={onPress}
      className="rounded-full border border-[#C4A015] bg-white px-3.5 py-2"
      style={({ pressed }) => [pressed && { opacity: 0.88 }]}>
      <Text className="font-geist-semibold text-[12px] text-[#8A6D10]">Set Reminder</Text>
    </Pressable>
  );
}

import { Pressable, Text, View } from 'react-native';

import { NotificationTypeIcon } from '@/components/notifications/notification-icons';
import type { NotificationItem } from '@/constants/notifications-data';
import { cn } from '@/lib/cn';

type NotificationRowProps = {
  item: NotificationItem;
  onPress?: (item: NotificationItem) => void;
};

export function NotificationRow({ item, onPress }: NotificationRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(item)}
      className="flex-row items-start gap-3 py-4">
      <View className="w-2 items-center pt-4">
        {item.unread ? <View className="h-2 w-2 rounded-full bg-[#16A34A]" /> : null}
      </View>

      <NotificationTypeIcon type={item.icon} />

      <View className="min-w-0 flex-1 gap-1">
        <Text className="font-geist-semibold text-[15px] text-stone-title">{item.title}</Text>
        <Text className="font-geist text-[13px] leading-[18px] text-[#6B7280]">{item.body}</Text>
        <Text className="mt-0.5 font-geist text-[12px] text-[#9CA3AF]">{item.time}</Text>
      </View>
    </Pressable>
  );
}

type NotificationFilterChipsProps = {
  activeFilter: string;
  filters: readonly { id: string; label: string }[];
  onChange: (id: string) => void;
};

export function NotificationFilterChips({
  activeFilter,
  filters,
  onChange,
}: NotificationFilterChipsProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {filters.map((filter) => {
        const active = filter.id === activeFilter;

        return (
          <Pressable
            key={filter.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(filter.id)}
            className={cn(
              'rounded-full px-4 py-2',
              active ? 'bg-stone-title' : 'bg-[#F3F4F6]',
            )}>
            <Text
              className={cn(
                'font-geist-medium text-[13px]',
                active ? 'text-white' : 'text-stone-title',
              )}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

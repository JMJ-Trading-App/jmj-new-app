import { Pressable, Text, View } from 'react-native';

import { BellIcon, RankBadgeIcon } from '@/components/home/home-icons';

type HomeHeaderProps = {
  firstName: string;
  initials: string;
  unreadCount?: number;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
};

export function HomeHeader({
  firstName,
  initials,
  unreadCount = 0,
  onNotificationsPress,
  onProfilePress,
}: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        onPress={onProfilePress}
        className="flex-row items-center gap-3">
        <View className="relative">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-brand-tint">
            <Text className="font-geist-semibold text-sm text-stone-title">{initials}</Text>
          </View>
          <View className="absolute -right-0.5 -top-0.5">
            <RankBadgeIcon size={16} />
          </View>
        </View>

        <Text className="font-geist-semibold text-base text-stone-title">Hi, {firstName}</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        onPress={onNotificationsPress}
        className="relative h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
        <BellIcon />
        {unreadCount > 0 ? (
          <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
        ) : null}
      </Pressable>
    </View>
  );
}

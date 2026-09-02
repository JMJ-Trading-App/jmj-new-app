import { Pressable, Text, View } from 'react-native';

import {
  CandlesIcon,
  EmptyActivityIcon,
  LinkIcon,
  SignalsIcon,
  TrendIcon,
} from '@/components/home/home-icons';
import type { ActivityItem } from '@/constants/home-data';
import { cn } from '@/lib/cn';

type RecentActivitiesProps = {
  activities?: ActivityItem[];
  onViewAllPress?: () => void;
  onItemPress?: (item: ActivityItem) => void;
};

function ActivityIcon({ category }: { category: ActivityItem['category'] }) {
  switch (category) {
    case 'deposit':
      return <TrendIcon color="#166534" size={18} />;
    case 'withdrawal':
      return <TrendIcon color="#991B1B" size={18} />;
    case 'investment':
      return <CandlesIcon color="#1C1917" size={18} />;
    case 'pool':
      return <LinkIcon color="#1C1917" size={18} />;
    case 'signal':
      return <SignalsIcon color="#1C1917" size={18} />;
    default:
      return <EmptyActivityIcon size={18} />;
  }
}

export function RecentActivities({
  activities = [],
  onViewAllPress,
  onItemPress,
}: RecentActivitiesProps) {
  const isEmpty = activities.length === 0;

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-geist-bold text-lg text-stone-title">Recent Activities</Text>
        <Pressable accessibilityRole="button" onPress={onViewAllPress}>
          <Text className="font-geist-medium text-[13px] text-muted">View All</Text>
        </Pressable>
      </View>

      {isEmpty ? (
        <View className="items-center gap-3 py-8">
          <EmptyActivityIcon />
          <Text className="font-geist-semibold text-base text-stone-title">No activity yet</Text>
          <Text className="font-geist text-sm text-muted">Your transactions will appear here.</Text>
        </View>
      ) : (
        <View className="gap-2">
          {activities.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => onItemPress?.(item)}
              className="flex-row items-center gap-3 rounded-2xl bg-[#F7F7F5] px-3 py-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
                <ActivityIcon category={item.category} />
              </View>

              <View className="min-w-0 flex-1 gap-0.5">
                <Text className="font-geist-semibold text-[14px] text-stone-title" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="font-geist text-[12px] text-muted">{item.subtitle}</Text>
              </View>

              <Text
                className={cn(
                  'font-geist-semibold text-[14px]',
                  item.type === 'credit' ? 'text-[#166534]' : 'text-stone-title',
                )}>
                {item.amount}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

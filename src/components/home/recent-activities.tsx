import { Pressable, Text, View } from 'react-native';

import {
  CandlesIcon,
  EmptyActivityIcon,
  LinkIcon,
  SignalsIcon,
  TrendIcon,
} from '@/components/home/home-icons';
import type { ActivityItem } from '@/lib/activity';
import { cn } from '@/lib/cn';

type RecentActivitiesProps = {
  activities?: ActivityItem[];
  onViewAllPress?: () => void;
  onItemPress?: (item: ActivityItem) => void;
  hideViewAll?: boolean;
  title?: string;
};

function ActivityIcon({
  category,
  type,
}: {
  category: ActivityItem['category'];
  type: ActivityItem['type'];
}) {
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
    case 'metatrader':
      return (
        <TrendIcon
          color={type === 'credit' ? '#166534' : '#991B1B'}
          direction={type === 'credit' ? 'up' : 'down'}
          size={18}
        />
      );
    default:
      return <EmptyActivityIcon size={18} />;
  }
}

export function RecentActivities({
  activities = [],
  onViewAllPress,
  onItemPress,
  hideViewAll = false,
  title = 'Recent Activities',
}: RecentActivitiesProps) {
  const isEmpty = activities.length === 0;

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-geist-bold text-lg text-stone-title">{title}</Text>
        {hideViewAll ? null : (
          <Pressable accessibilityRole="button" onPress={onViewAllPress} hitSlop={8}>
            <Text className="font-geist-medium text-[13px] text-muted">View All</Text>
          </Pressable>
        )}
      </View>

      {isEmpty ? (
        <View className="items-center gap-3 py-8">
          <EmptyActivityIcon />
          <Text className="font-geist-semibold text-base text-stone-title">No activity yet</Text>
          <Text className="font-geist text-sm text-muted">
            MetaTrader trades will appear here after sync.
          </Text>
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
                <ActivityIcon category={item.category} type={item.type} />
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
                  item.category === 'metatrader'
                    ? item.type === 'credit'
                      ? 'text-[#166534]'
                      : 'text-[#991B1B]'
                    : item.type === 'credit'
                      ? 'text-[#166534]'
                      : 'text-stone-title',
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

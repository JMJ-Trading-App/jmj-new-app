import { Pressable, Text, View } from 'react-native';

import { CandlesIcon, ChevronRightIcon, SignalsIcon } from '@/components/home/home-icons';

const EXPLORE_ITEMS = [
  {
    id: 'classes',
    title: 'Trading Classes',
    description: 'Master the markets, one lesson at a time.',
    Icon: CandlesIcon,
  },
  {
    id: 'signals',
    title: 'Signals',
    description: 'Real-time alerts for smarter trade timing.',
    Icon: SignalsIcon,
  },
] as const;

type ExploreSectionProps = {
  onItemPress?: (id: string) => void;
};

export function ExploreSection({ onItemPress }: ExploreSectionProps) {
  return (
    <View className="gap-3">
      <Text className="font-geist-bold text-lg text-stone-title">Explore</Text>

      <View className="flex-row gap-3">
        {EXPLORE_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            onPress={() => onItemPress?.(item.id)}
            className="min-h-[168px] flex-1 justify-between rounded-[20px] bg-explore-card p-4">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-stone-title">
              <item.Icon />
            </View>

            <View className="mt-6 gap-1.5">
              <Text className="font-geist-semibold text-[15px] text-stone-title">{item.title}</Text>
              <Text className="font-geist text-[12px] leading-[16px] text-stone-body">
                {item.description}
              </Text>
            </View>

            <View className="mt-4 items-end">
              <ChevronRightIcon />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

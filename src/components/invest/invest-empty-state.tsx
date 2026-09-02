import { Text, View } from 'react-native';

import { EmptyActivityIcon } from '@/components/home/home-icons';

export function InvestEmptyState() {
  return (
    <View className="items-center justify-center py-16">
      <EmptyActivityIcon color="#D1D5DB" size={56} />
      <Text className="mt-4 font-geist-bold text-[16px] text-stone-title">No investments yet</Text>
    </View>
  );
}

import { Text, View } from 'react-native';

import { EmptyActivityIcon } from '@/components/home/home-icons';

export function PoolEmptyState() {
  return (
    <View className="items-center justify-center px-6 py-16">
      <EmptyActivityIcon color="#D1D5DB" size={56} />
      <Text className="mt-4 font-geist-bold text-[16px] text-stone-title">No pool yet</Text>
      <Text className="mt-2 text-center font-geist text-[14px] leading-[20px] text-muted">
        Join a pool to invest collectively with other members and share in the returns.
      </Text>
    </View>
  );
}

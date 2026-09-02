import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset } from '@/constants/theme';

type PlaceholderTabScreenProps = {
  title: string;
};

export function PlaceholderTabScreen({ title }: PlaceholderTabScreenProps) {
  return (
    <View className="flex-1 bg-[#F7F7F5]">
      <SafeAreaView
        className="flex-1 items-center justify-center px-6"
        style={{ paddingBottom: BottomTabInset }}>
        <ThemedText type="heading" className="text-center text-stone-title">
          {title}
        </ThemedText>
        <ThemedText type="body" themeColor="textMuted" className="mt-2 text-center">
          Coming soon
        </ThemedText>
      </SafeAreaView>
    </View>
  );
}

import { version } from 'expo/package.json';
import { Image } from 'expo-image';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function WebBadge() {
  return (
    <ThemedView className="items-center gap-2 p-8">
      <ThemedText type="code" themeColor="textSecondary" className="text-center">
        v{version}
      </ThemedText>
      <Image
        source={require('@/assets/images/expo-badge.png')}
        style={{ width: 123, aspectRatio: 123 / 24 }}
      />
    </ThemedView>
  );
}

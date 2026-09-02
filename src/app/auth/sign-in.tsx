import { router } from 'expo-router';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';

export default function SignInScreen() {
  return (
    <Screen
      onBack={() => router.back()}
      footer={<Button label="Sign in" onPress={() => router.replace('/(tabs)/home')} />}>
      <View className="flex-1 gap-2 pt-8">
        <ThemedText type="heading" className="text-left">
          Welcome back
        </ThemedText>
        <ThemedText type="body" themeColor="textMuted" className="text-left">
          Sign-in form will go here. Backend connection coming later.
        </ThemedText>
      </View>
    </Screen>
  );
}

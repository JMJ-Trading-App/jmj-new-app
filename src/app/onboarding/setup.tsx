import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';

export default function OnboardingSetupScreen() {
  return (
    <Screen
      onBack={() => router.back()}
      footer={
        <Button label="Get Started" onPress={() => router.push('/auth/sign-up')} />
      }>
      <View className="flex-1 items-center justify-center pb-8">
        <Image
          source={require('@/assets/images/onboarding/shield.png')}
          style={{ width: 280, height: 280, marginBottom: 32 }}
          contentFit="contain"
        />

        <View className="max-w-[320px] items-center gap-2">
          <ThemedText type="heading" className="text-center">
            Let&apos;s Set Up Your Account!
          </ThemedText>
          <ThemedText type="body" themeColor="textMuted" className="text-center">
            A few quick details so we can personalize your experience and keep your account secure.
          </ThemedText>
        </View>
      </View>
    </Screen>
  );
}

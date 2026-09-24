import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';

export default function OnboardingSetupScreen() {
  return (
    <Screen
      onBack={() => router.back()}
      footer={
        <View className="gap-3">
          <Button label="Get Started" onPress={() => router.push('/auth/sign-up')} />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/auth/sign-in')}>
            <ThemedText className="text-center font-geist-medium text-[14px] text-stone-body">
              Already have an account?{' '}
              <ThemedText className="font-geist-semibold text-stone-title">
                Sign in
              </ThemedText>
            </ThemedText>
          </Pressable>
        </View>
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

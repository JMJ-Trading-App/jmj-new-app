import { router, type Href } from 'expo-router';
import { Pressable, View } from 'react-native';

import { SuccessBadge } from '@/components/onboarding/success-badge';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { getSignupFirstName } from '@/lib/mock-auth';

export default function OnboardingCompleteScreen() {
  const firstName = getSignupFirstName() || 'there';

  return (
    <Screen
      hideHeader
      showBackButton={false}
      footer={
        <View className="gap-4">
          <Button label="Continue" onPress={() => router.replace('/(tabs)/home')} />
          <Pressable accessibilityRole="button" onPress={() => router.push('/kyc' as Href)}>
            <ThemedText className="text-center font-geist-semibold text-base leading-[22px] text-stone-title">
              Complete KYC now
            </ThemedText>
          </Pressable>
        </View>
      }>
      <View className="flex-1 pt-8">
        <View className="max-w-[320px] items-center gap-4 self-center">
          <SuccessBadge />

          <ThemedText className="text-center font-geist-semibold text-[22px] leading-[30px] text-stone-title">
            You&apos;re all set, {firstName}!
          </ThemedText>

          <ThemedText className="text-center font-geist-medium text-[15px] leading-6 text-stone-body">
            Your account is ready. Complete KYC anytime to unlock funding, withdrawals and pool
            investing.
          </ThemedText>

          <View className="mt-1 rounded-[37px] bg-kyc-badge px-4 py-1.5">
            <ThemedText className="font-geist-medium text-[13px] text-stone-title">
              KYC pending
            </ThemedText>
          </View>
        </View>
      </View>
    </Screen>
  );
}

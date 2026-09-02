import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SmsMethodIcon, TwoFactorHero } from '@/components/more/two-factor-icons';
import { Button } from '@/components/ui/button';

export default function TwoFactorSetupScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-2 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            Two-Factor Authentication
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <View className="flex-1 gap-8 px-5 pt-6">
        <View className="items-center gap-4">
          <TwoFactorHero />
          <Text className="text-center font-geist-bold text-[24px] text-stone-title">
            Add Extra Security
          </Text>
          <Text className="text-center font-geist text-[15px] leading-[22px] text-muted">
            Two-factor authentication adds an additional layer of security to your account by
            requiring a verification code when you sign in.
          </Text>
        </View>

        <View className="gap-2">
          <Text className="font-geist-semibold text-[11px] tracking-[0.08em] text-muted">METHOD</Text>
          <View className="flex-row items-center gap-3 rounded-[16px] border border-[#E5E7EB] bg-white px-4 py-4">
            <SmsMethodIcon />
            <View className="min-w-0 flex-1 gap-0.5">
              <Text className="font-geist-bold text-[15px] text-stone-title">SMS Verification</Text>
              <Text className="font-geist text-[13px] leading-[18px] text-muted">
                Receive verification codes via text message
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button
          label="Request OTP"
          onPress={() => router.push('/two-factor/verify' as Href)}
        />
      </View>
    </View>
  );
}

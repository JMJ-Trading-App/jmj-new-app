import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TwoFactorSuccessBadge } from '@/components/more/two-factor-icons';
import { Button } from '@/components/ui/button';

export default function TwoFactorSuccessScreen() {
  const insets = useSafeAreaInsets();

  function handleDone() {
    router.replace('/(tabs)/more' as Href);
  }

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
            2FA Enabled
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <View className="flex-1 items-center justify-center gap-4 px-5">
        <TwoFactorSuccessBadge />
        <Text className="text-center font-geist-bold text-[24px] leading-[32px] text-stone-title">
          Two-Factor Authentication Enabled!
        </Text>
        <Text className="text-center font-geist text-[15px] leading-[22px] text-stone-body">
          Your account is now more secure. You will need to enter a verification code each time you
          sign in.
        </Text>
      </View>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button label="Done" onPress={handleDone} />
      </View>
    </View>
  );
}

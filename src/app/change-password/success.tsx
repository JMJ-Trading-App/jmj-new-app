import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SuccessCheckBadge } from '@/components/invest/invest-flow-icons';
import { Button } from '@/components/ui/button';

export default function ChangePasswordSuccessScreen() {
  const insets = useSafeAreaInsets();

  function goHome() {
    router.replace('/(tabs)/home' as Href);
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
            Change Password
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <View className="flex-1 items-center justify-center gap-4 px-5">
        <SuccessCheckBadge />
        <Text className="text-center font-geist-bold text-[24px] text-stone-title">
          Password Updated!
        </Text>
        <Text className="text-center font-geist text-[15px] leading-[22px] text-stone-body">
          Your password has been changed successfully. Use your new password next time you log in.
        </Text>
      </View>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button label="Go Home" onPress={goHome} />
      </View>
    </View>
  );
}

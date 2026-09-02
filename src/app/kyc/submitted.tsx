import { router, type Href } from 'expo-router';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  NotificationBellSmallIcon,
  SuccessCheckBadge,
  WhatsAppIcon,
} from '@/components/invest/invest-flow-icons';

export default function KycSubmittedScreen() {
  const insets = useSafeAreaInsets();

  function goHome() {
    router.replace('/(tabs)/home' as Href);
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow items-center justify-center gap-8 px-5 pb-6"
        contentContainerStyle={{ paddingTop: insets.top + 24 }}
        showsVerticalScrollIndicator={false}>
        <View className="items-center gap-4">
          <SuccessCheckBadge />
          <Text className="text-center font-geist-bold text-[24px] leading-[32px] text-stone-title">
            Your details has been submitted for review!
          </Text>
          <Text className="text-center font-geist text-[15px] leading-[22px] text-stone-body">
            We&apos;re currently reviewing the details you submitted. This usually takes a short
            while — we&apos;ll notify you as soon as it&apos;s verified.
          </Text>
        </View>

        <View className="w-full flex-row items-center gap-2 px-1">
          <NotificationBellSmallIcon />
          <Text className="flex-1 font-geist text-[13px] leading-[18px] text-muted">
            You will receive a notification on the status of your KYC verification
          </Text>
        </View>
      </ScrollView>

      <View className="gap-3 px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Follow up on WhatsApp"
          onPress={() => Linking.openURL('https://wa.me/')}
          className="flex-row items-center justify-center gap-2 rounded-[14px] border border-[#B7E4C7] bg-[#E8F8F0] py-[16px]"
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
          <WhatsAppIcon />
          <Text className="font-geist-semibold text-[16px] text-[#128C7E]">
            Follow up on WhatsApp
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
          onPress={goHome}
          className="items-center justify-center rounded-[14px] border border-stone-title bg-white py-[16px]"
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
          <Text className="font-geist-semibold text-[16px] text-stone-title">Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

import { router, type Href } from 'expo-router';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  NotificationBellSmallIcon,
  StatusCheckIcon,
  SuccessCheckBadge,
  WhatsAppIcon,
} from '@/components/invest/invest-flow-icons';
import { cn } from '@/lib/cn';
import { getPoolDraft } from '@/lib/pool-draft';
import { useSupportSettings } from '@/hooks/use-support-settings';

const STATUS_STEPS = [
  { id: 'submitted', title: 'Payment Submitted', subtitle: 'Completed', state: 'done' },
  { id: 'verification', title: 'Verification in Progress', subtitle: 'Current', state: 'current' },
  { id: 'active', title: 'Pool Position Active', subtitle: 'Pending', state: 'pending' },
] as const;

export default function PoolStatusScreen() {
  const insets = useSafeAreaInsets();
  const { settings } = useSupportSettings();
  const draft = getPoolDraft();
  const serviceCharge = draft.serviceCharge ?? 'your';
  const poolName = draft.poolName ?? 'this pool';
  const reference = draft.paymentReference ?? '—';

  function goPools() {
    router.replace('/(tabs)/pool' as Href);
  }

  function goHome() {
    router.replace('/(tabs)/home' as Href);
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-8 px-5 pb-6"
        contentContainerStyle={{ paddingTop: insets.top + 24 }}
        showsVerticalScrollIndicator={false}>
        <View className="items-center gap-4 pt-2">
          <SuccessCheckBadge />
          <Text className="text-center font-geist-bold text-[24px] text-stone-title">
            Pool Contribution Submitted!
          </Text>
          <Text className="text-center font-geist text-[15px] leading-[22px] text-stone-body">
            Your {serviceCharge} service charge payment for {poolName} has been submitted. We will
            verify your payment and activate your pool position.
          </Text>
          <View className="rounded-full bg-[#F3F4F6] px-4 py-2">
            <Text className="font-geist-medium text-[13px] text-muted">Ref: {reference}</Text>
          </View>
        </View>

        <View className="gap-0 px-1">
          {STATUS_STEPS.map((step, index) => {
            const isLast = index === STATUS_STEPS.length - 1;
            const lineActive = step.state === 'done';

            return (
              <View key={step.id} className="flex-row gap-3">
                <View className="items-center">
                  {step.state === 'done' ? (
                    <StatusCheckIcon />
                  ) : (
                    <View
                      className={cn(
                        'mt-1 h-3 w-3 rounded-full',
                        step.state === 'current' ? 'bg-success' : 'bg-[#D1D5DB]',
                      )}
                    />
                  )}
                  {!isLast ? (
                    <View
                      className={cn('my-1 w-0.5 flex-1', lineActive ? 'bg-success' : 'bg-[#E5E7EB]')}
                      style={{ minHeight: 28 }}
                    />
                  ) : null}
                </View>

                <View className={cn('flex-1', isLast ? 'pb-0' : 'pb-5')}>
                  <Text
                    className={cn(
                      'font-geist-bold text-[15px]',
                      step.state === 'pending' ? 'text-muted' : 'text-stone-title',
                    )}>
                    {step.title}
                  </Text>
                  <Text
                    className={cn(
                      'mt-0.5 font-geist text-[13px]',
                      step.state === 'current' ? 'text-success' : 'text-muted',
                    )}>
                    {step.subtitle}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View className="flex-row items-center gap-2">
          <NotificationBellSmallIcon />
          <Text className="flex-1 font-geist text-[13px] leading-[18px] text-muted">
            You will receive a notification when your pool position is active.
          </Text>
        </View>
      </ScrollView>

      <View className="gap-3 px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Follow up on WhatsApp"
          onPress={() => Linking.openURL(settings.whatsappUrl)}
          className="flex-row items-center justify-center gap-2 rounded-[14px] bg-[#E8F8F0] py-[16px]"
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
          <WhatsAppIcon />
          <Text className="font-geist-semibold text-[16px] text-[#128C7E]">
            Follow up on WhatsApp
          </Text>
        </Pressable>

        <View className="flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={goPools}
            className="flex-1 items-center justify-center rounded-[14px] bg-stone-title py-[16px]"
            style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
            <Text className="font-geist-semibold text-[16px] text-white">Back to Pools</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={goHome}
            className="flex-1 items-center justify-center rounded-[14px] border border-stone-title bg-white py-[16px]"
            style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
            <Text className="font-geist-semibold text-[16px] text-stone-title">Home</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

import { router, useLocalSearchParams, type Href } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SuccessCheckBadge } from '@/components/invest/invest-flow-icons';
import { SubscriptionSuccessSummary } from '@/components/subscriptions/subscription-success-summary';
import { Button } from '@/components/ui/button';
import {
  CLASS_PLANS,
  getPlanById,
  getSubscriptionSuccessCopy,
  SUBSCRIPTION_PAYMENT_METHOD,
} from '@/constants/subscriptions-data';

export default function SubscriptionSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { planId } = useLocalSearchParams<{ planId?: string }>();

  const plan = getPlanById(planId ?? '') ?? CLASS_PLANS.find((item) => item.id === 'classes-vip')!;
  const typeLabel = plan.category === 'classes' ? 'Classes' : 'Signals';

  function goHome() {
    router.replace('/(tabs)/home' as Href);
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 16 }}>
        <Text className="font-geist-bold text-[24px] text-stone-title">Investment Status</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="grow items-center justify-center gap-5 px-5 pb-6"
        showsVerticalScrollIndicator={false}>
        <View className="items-center gap-4">
          <SuccessCheckBadge />
          <Text className="text-center font-geist-bold text-[28px] leading-[34px] text-stone-title">
            You&apos;re in!
          </Text>
          <Text className="text-center font-geist text-[15px] leading-[22px] text-stone-body">
            {getSubscriptionSuccessCopy(plan.category)}
          </Text>
        </View>

        <SubscriptionSuccessSummary
          rows={[
            { label: 'Plan', value: plan.name },
            { label: 'Type', value: typeLabel },
            { label: 'Billing', value: plan.billingLabel, emphasize: false },
            {
              label: 'Payment method',
              value: SUBSCRIPTION_PAYMENT_METHOD,
              emphasize: false,
            },
          ]}
        />
      </ScrollView>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button label="Back to Home" onPress={goHome} />
      </View>
    </View>
  );
}

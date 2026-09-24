import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SuccessCheckBadge } from '@/components/invest/invest-flow-icons';
import { SubscriptionSuccessSummary } from '@/components/subscriptions/subscription-success-summary';
import { Button } from '@/components/ui/button';
import {
  getSubscriptionSuccessCopy,
  SUBSCRIPTION_PAYMENT_METHOD,
  type SubscriptionPlan,
} from '@/constants/subscriptions-data';
import type { SubscriptionPlanApi } from '@/lib/api/types';
import { alertError } from '@/lib/errors';
import { fetchSubscriptionPlans } from '@/lib/subscriptions';

function mapPlan(plan: SubscriptionPlanApi): SubscriptionPlan {
  return {
    id: plan.id,
    category: plan.category,
    name: plan.name,
    duration: plan.duration,
    price: plan.price,
    billingLabel: plan.billingLabel,
    features: plan.features,
    badgeTier: plan.badgeTier,
    popular: plan.popular,
  };
}

export default function SubscriptionSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { planId } = useLocalSearchParams<{ planId?: string }>();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const result = await fetchSubscriptionPlans();
        const found =
          result.plans.find((item) => item.id === planId) ?? result.plans[0];
        setPlan(found ? mapPlan(found) : null);
      } catch (error) {
        alertError(error, 'Could not load plan');
      } finally {
        setLoading(false);
      }
    })();
  }, [planId]);

  function goHome() {
    router.replace('/(tabs)/home' as Href);
  }

  if (loading || !plan) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#C4A015" />
      </View>
    );
  }

  const typeLabel = plan.category === 'classes' ? 'Classes' : 'Signals';

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 16 }}>
        <Text className="font-geist-bold text-[24px] text-stone-title">Subscription</Text>
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

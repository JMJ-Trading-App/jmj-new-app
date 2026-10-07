import * as WebBrowser from 'expo-web-browser';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SubscriptionPlanCard } from '@/components/subscriptions/subscription-plan-card';
import { SubscriptionTabs } from '@/components/subscriptions/subscription-tabs';
import { Button } from '@/components/ui/button';
import type { SubscriptionCategory, SubscriptionPlan } from '@/constants/subscriptions-data';
import type { SubscriptionPlanApi } from '@/lib/api/types';
import { alertError, alertSuccess } from '@/lib/errors';
import { waitForWhopPayment } from '@/lib/whop-checkout';
import {
  checkoutSubscription,
  fetchSubscriptionPlans,
  verifySubscriptionPayment,
} from '@/lib/subscriptions';

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

export default function SubscriptionsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tab?: string }>();

  const initialTab: SubscriptionCategory =
    params.tab === 'classes' ? 'classes' : 'signals';

  const [tab, setTab] = useState<SubscriptionCategory>(initialTab);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [signalsPlans, setSignalsPlans] = useState<SubscriptionPlan[]>([]);
  const [classesPlans, setClassesPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const result = await fetchSubscriptionPlans();
        setSignalsPlans(result.signals.map(mapPlan));
        setClassesPlans(result.classes.map(mapPlan));
      } catch (error) {
        alertError(error, 'Could not load plans');
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const plans = useMemo(
    () => (tab === 'signals' ? signalsPlans : classesPlans),
    [tab, signalsPlans, classesPlans],
  );

  function handleTabChange(next: SubscriptionCategory) {
    setTab(next);
    setSelectedId(null);
  }

  async function handleContinue() {
    if (!selectedId || loading) return;
    setLoading(true);

    try {
      const result = await checkoutSubscription(selectedId);

      if (
        (result.payment.mode === 'whop' || result.payment.mode === 'paystack') &&
        result.payment.authorizationUrl
      ) {
        await WebBrowser.openBrowserAsync(result.payment.authorizationUrl);
        if (result.payment.mode === 'whop') {
          const status = await waitForWhopPayment(result.payment.reference);
          if (status.status !== 'PAID') {
            throw new Error(
              'Payment is not confirmed yet. If you completed checkout, the plan activates once Whop confirms it.',
            );
          }
        }
        const verified = await verifySubscriptionPayment(result.payment.reference);
        alertSuccess(verified.message);
      } else {
        alertSuccess(result.message);
      }

      router.push(`/subscriptions/success?planId=${encodeURIComponent(selectedId)}` as Href);
    } catch (error) {
      alertError(error, 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="mb-3 h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
          <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
        </Pressable>

        <Text className="mb-5 font-geist-bold text-[28px] leading-[34px] text-stone-title">
          Subscriptions
        </Text>

        <SubscriptionTabs value={tab} onChange={handleTabChange} />
      </View>

      {booting ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#C4A015" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-3 px-5 pb-6 pt-5"
          showsVerticalScrollIndicator={false}>
          {plans.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              selected={selectedId === plan.id}
              onPress={() => setSelectedId(plan.id)}
            />
          ))}
        </ScrollView>
      )}

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button
          disabled={!selectedId || booting}
          label="Continue"
          loading={loading}
          onPress={() => void handleContinue()}
        />
      </View>
    </View>
  );
}

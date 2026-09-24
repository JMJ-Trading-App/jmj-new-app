import * as WebBrowser from 'expo-web-browser';
import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SignalsPlanOption } from '@/components/signals/signals-plan-option';
import { Button } from '@/components/ui/button';
import {
  SIGNAL_PLAN_BENEFITS,
  SIGNAL_PLAN_FOOTNOTE,
  type SubscriptionPlan,
} from '@/constants/subscriptions-data';
import type { SubscriptionPlanApi } from '@/lib/api/types';
import { alertError, alertSuccess } from '@/lib/errors';
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

export default function SignalsPlanScreen() {
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const result = await fetchSubscriptionPlans();
        const mapped = result.signals.map(mapPlan);
        setPlans(mapped);
        setSelectedId(mapped.find((p) => p.popular)?.id ?? mapped[0]?.id ?? null);
      } catch (error) {
        alertError(error, 'Could not load plans');
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedId) ?? null,
    [selectedId, plans],
  );

  async function handleContinue() {
    if (!selectedPlan || loading) return;
    setLoading(true);

    try {
      const result = await checkoutSubscription(selectedPlan.id);

      if (result.payment.mode === 'paystack' && result.payment.authorizationUrl) {
        await WebBrowser.openBrowserAsync(result.payment.authorizationUrl);
        const verified = await verifySubscriptionPayment(result.payment.reference);
        alertSuccess(verified.message);
        router.push(
          `/subscriptions/success?planId=${encodeURIComponent(selectedPlan.id)}` as Href,
        );
        return;
      }

      alertSuccess(result.message);
      router.push(
        `/subscriptions/success?planId=${encodeURIComponent(selectedPlan.id)}` as Href,
      );
    } catch (error) {
      alertError(error, 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-4 flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="font-geist-bold text-[24px] text-stone-title">Signals plan</Text>
        </View>
      </View>

      {booting ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#C4A015" />
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-6 px-5 pb-6"
            showsVerticalScrollIndicator={false}>
            <View className="rounded-[18px] border border-[#EFEFEF] bg-white px-4 py-4">
              <Text className="mb-2 font-geist-semibold text-[11px] tracking-[0.08em] text-muted">
                {SIGNAL_PLAN_BENEFITS.label}
              </Text>
              <Text className="font-geist text-[14px] leading-[20px] text-stone-title">
                {SIGNAL_PLAN_BENEFITS.body}
              </Text>
            </View>

            <View className="gap-3">
              <Text className="font-geist-medium text-[15px] text-stone-body">Select your plan</Text>

              <View className="gap-3 pt-1">
                {plans.map((plan) => (
                  <SignalsPlanOption
                    key={plan.id}
                    plan={plan}
                    selected={selectedId === plan.id}
                    onPress={() => setSelectedId(plan.id)}
                  />
                ))}
              </View>

              <Text className="px-2 pt-2 text-center font-geist text-[12px] leading-[17px] text-muted">
                {SIGNAL_PLAN_FOOTNOTE}
              </Text>
            </View>
          </ScrollView>

          <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
            <Button
              disabled={!selectedPlan}
              label={selectedPlan ? `Continue - ${selectedPlan.price}` : 'Continue'}
              loading={loading}
              onPress={() => void handleContinue()}
            />
          </View>
        </>
      )}
    </View>
  );
}

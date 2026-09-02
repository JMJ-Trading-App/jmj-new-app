import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SignalsPlanOption } from '@/components/signals/signals-plan-option';
import { Button } from '@/components/ui/button';
import {
  SIGNAL_PLAN_BENEFITS,
  SIGNAL_PLAN_FOOTNOTE,
  SIGNAL_PLANS,
} from '@/constants/subscriptions-data';

export default function SignalsPlanScreen() {
  const insets = useSafeAreaInsets();
  const defaultPlanId =
    SIGNAL_PLANS.find((plan) => plan.popular)?.id ?? SIGNAL_PLANS[0]?.id ?? null;

  const [selectedId, setSelectedId] = useState<string | null>(defaultPlanId);
  const [loading, setLoading] = useState(false);

  const selectedPlan = useMemo(
    () => SIGNAL_PLANS.find((plan) => plan.id === selectedId) ?? null,
    [selectedId],
  );

  async function handleContinue() {
    if (!selectedPlan || loading) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);

    router.push(
      `/subscriptions/success?planId=${encodeURIComponent(selectedPlan.id)}` as Href,
    );
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
            {SIGNAL_PLANS.map((plan) => (
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
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}

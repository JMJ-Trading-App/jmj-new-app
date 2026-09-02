import { router, useLocalSearchParams, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SubscriptionPlanCard } from '@/components/subscriptions/subscription-plan-card';
import { SubscriptionTabs } from '@/components/subscriptions/subscription-tabs';
import { Button } from '@/components/ui/button';
import {
  getPlansForCategory,
  type SubscriptionCategory,
} from '@/constants/subscriptions-data';

export default function SubscriptionsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tab?: string }>();

  const initialTab: SubscriptionCategory =
    params.tab === 'classes' ? 'classes' : 'signals';

  const [tab, setTab] = useState<SubscriptionCategory>(initialTab);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plans = useMemo(() => getPlansForCategory(tab), [tab]);

  function handleTabChange(next: SubscriptionCategory) {
    setTab(next);
    setSelectedId(null);
  }

  async function handleContinue() {
    if (!selectedId || loading) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);

    router.push(`/subscriptions/success?planId=${encodeURIComponent(selectedId)}` as Href);
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

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button
          disabled={!selectedId}
          label="Continue"
          loading={loading}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}

import * as WebBrowser from 'expo-web-browser';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import {
  getPoolJoinProjection,
  parsePoolSize,
  type PoolItem,
} from '@/constants/pool-data';
import type { PoolItemApi } from '@/lib/api/types';
import { cn } from '@/lib/cn';
import { alertError, alertSuccess } from '@/lib/errors';
import { fetchPool, joinPool } from '@/lib/pool';
import { setPoolSubmitResult } from '@/lib/pool-draft';
import { isHostedCheckout, waitForWhopPayment } from '@/lib/whop-checkout';

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function mapPool(pool: PoolItemApi): PoolItem {
  return {
    id: pool.id,
    name: pool.name,
    status: pool.status,
    shortDescription: pool.shortDescription,
    about: pool.about,
    duration: pool.duration,
    minContribution: pool.minContribution,
    minContributionValue: pool.minContributionValue,
    contributorsLabel: pool.contributorsLabel,
    contributorsJoined: pool.contributorsJoined,
    contributorsNeeded: pool.contributorsNeeded,
    raisedLabel: pool.raisedLabel,
    raisedProgress: pool.raisedProgress,
    joinProgress: pool.joinProgress,
    poolSize: pool.poolSize,
    returns: pool.returns,
    opensIn: pool.opensIn,
    targetLabel: pool.targetLabel,
    returnLabel: pool.returnLabel,
    yourEarnings: pool.yourEarnings,
    position: pool.position,
    gains: pool.gains,
    ctaLabel: pool.ctaLabel,
  };
}

export default function PoolPaymentScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [accepted, setAccepted] = useState(false);
  const [pool, setPool] = useState<PoolItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void (async () => {
      if (!id) return;
      try {
        const result = await fetchPool(id);
        setPool(mapPool(result));
      } catch (error) {
        alertError(error, 'Could not load payment details');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const projection = useMemo(() => {
    if (!pool) return null;
    return getPoolJoinProjection(pool.minContributionValue, parsePoolSize(pool.poolSize));
  }, [pool]);

  async function handleSubmit() {
    if (submitting || !pool) return;
    setSubmitting(true);

    try {
      const result = await joinPool(pool.id, {
        contributionUsd: pool.minContributionValue,
      });
      setPoolSubmitResult({
        paymentReference: result.paymentReference,
        serviceCharge: result.serviceCharge,
      });

      if (isHostedCheckout(result.checkout?.mode) && result.checkout.url) {
        await WebBrowser.openBrowserAsync(result.checkout.url);
        const status = await waitForWhopPayment(result.checkout.paymentId);
        if (status.status !== 'PAID') {
          throw new Error(
            'Payment is not confirmed yet. If you completed checkout, the pool join activates once Bachs confirms it.',
          );
        }
        alertSuccess('Payment received');
      } else {
        alertSuccess(result.message);
      }

      router.push(`/pool/status/${pool.id}` as Href);
    } catch (error) {
      alertError(error, 'Could not start payment');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#C4A015" />
      </View>
    );
  }

  if (!pool || !projection) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5">
        <Text className="font-geist-bold text-base text-stone-title">Pool not found</Text>
        <Pressable className="mt-4" onPress={() => router.back()}>
          <Text className="font-geist-medium text-muted">Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-4 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            Payment
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-6 pt-4"
        showsVerticalScrollIndicator={false}>
        <View className="gap-2">
          <Text className="font-geist-bold text-[24px] leading-[30px] text-stone-title">
            Pay with Bachs
          </Text>
          <Text className="font-geist text-[14px] leading-[20px] text-muted">
            You will complete this contribution on Bachs. Your place in {pool.name} stays pending
            until the payment is confirmed.
          </Text>
        </View>

        <View className="gap-3 rounded-[18px] bg-[#F7F7F5] p-4">
          <Row label="Contribution" value={formatUsd(projection.contribution)} />
          <Row label="Service charge" value={formatUsd(projection.serviceCharge)} />
          <Row label="Total" value={formatUsd(projection.totalToPay)} />
        </View>
      </ScrollView>

      <View className="gap-4 px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
          onPress={() => setAccepted((current) => !current)}
          className="flex-row items-start gap-3"
          hitSlop={4}>
          <View
            className={cn(
              'mt-0.5 h-5 w-5 items-center justify-center rounded-[5px] border',
              accepted ? 'border-[#8A6D10] bg-[#8A6D10]' : 'border-[#D1D5DB] bg-white',
            )}>
            {accepted ? <Text className="font-geist-bold text-[11px] text-white">✓</Text> : null}
          </View>
          <Text className="flex-1 font-geist text-[14px] leading-[20px] text-stone-title">
            I have read and accept the <Text className="underline">Privacy Policy</Text> and{' '}
            <Text className="underline">Terms and Conditions</Text>
          </Text>
        </Pressable>

        <Button
          disabled={!accepted || submitting}
          label={submitting ? 'Opening checkout…' : 'Pay'}
          onPress={() => void handleSubmit()}
        />
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text className="font-geist text-[13px] text-muted">{label}</Text>
      <Text className="font-geist-semibold text-[13px] text-stone-title">{value}</Text>
    </View>
  );
}

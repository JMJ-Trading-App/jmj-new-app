import { router, useLocalSearchParams, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyActivityIcon } from '@/components/home/home-icons';
import { InfoCircleIcon } from '@/components/invest/invest-flow-icons';
import { PayoutAccountCard } from '@/components/invest/payout-account-card';
import { Button } from '@/components/ui/button';
import { PAYOUT_ACCOUNTS } from '@/constants/invest-flow-data';
import { getPoolById } from '@/constants/pool-data';

export default function PoolPayoutAccountScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pool = getPoolById(id ?? 'alpha-growth');

  const accounts = PAYOUT_ACCOUNTS;
  const defaultAccount = accounts.find((account) => account.isDefault) ?? accounts[0];
  const [selectedId, setSelectedId] = useState<string | null>(defaultAccount?.id ?? null);
  const isEmpty = accounts.length === 0;

  if (!pool) {
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
        <View className="mb-2 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            Payout Account
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-6 pt-4"
        showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          <Text className="font-geist-bold text-[24px] leading-[30px] text-stone-title">
            Where should we send your returns?
          </Text>
          <Text className="font-geist text-[14px] leading-[20px] text-stone-body">
            Select one of your saved accounts below. Investment payouts and returns will be
            automatically credited here.
          </Text>
        </View>

        {isEmpty ? (
          <View className="items-center gap-3 py-10">
            <EmptyActivityIcon color="#D1D5DB" size={56} />
            <Text className="font-geist-bold text-[16px] text-stone-title">
              No payout account yet
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {accounts.map((account) => (
              <PayoutAccountCard
                key={account.id}
                account={account}
                selected={selectedId === account.id}
                onPress={() => setSelectedId(account.id)}
              />
            ))}
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Link a new payout account"
          onPress={() => router.push('/payout-account/method' as Href)}
          className="items-center justify-center rounded-[18px] border border-dashed border-[#D1D5DB] py-4"
          style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
          <Text className="font-geist-semibold text-[15px] text-[#C4A015]">
            + Link a new payout account
          </Text>
        </Pressable>

        {!isEmpty ? (
          <View className="flex-row items-start gap-2">
            <InfoCircleIcon />
            <Text className="flex-1 font-geist text-[13px] leading-[18px] text-muted">
              You can update your payout accounts in Settings.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button
          disabled={isEmpty || !selectedId}
          label="Next"
          onPress={() => router.push(`/pool/payment/${pool.id}` as Href)}
        />
      </View>
    </View>
  );
}

import { useFocusEffect } from 'expo-router';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyActivityIcon } from '@/components/home/home-icons';
import { InfoCircleIcon } from '@/components/invest/invest-flow-icons';
import { PayoutAccountCard } from '@/components/invest/payout-account-card';
import { Button } from '@/components/ui/button';
import type { PayoutAccount } from '@/constants/invest-flow-data';
import { alertError } from '@/lib/errors';
import { fetchPool } from '@/lib/pool';
import { setPoolDraftPool } from '@/lib/pool-draft';
import { fetchPayoutAccounts } from '@/lib/payout';

export default function PoolPayoutAccountScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [poolName, setPoolName] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<PayoutAccount[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const [pool, payout] = await Promise.all([fetchPool(id), fetchPayoutAccounts()]);
      setPoolName(pool.name);
      setPoolDraftPool(pool.id, pool.name);

      const next: PayoutAccount[] = [];
      if (payout.bank) {
        next.push({
          id: payout.bank.id,
          title: `${payout.bank.bankName ?? 'Bank'} ${payout.bank.accountMasked ?? ''}`.trim(),
          subtitle: 'Naira Payout',
          type: 'bank',
          badge: payout.bank.isDefault ? 'DEFAULT' : undefined,
          isDefault: payout.bank.isDefault,
        });
      }
      if (payout.crypto) {
        next.push({
          id: payout.crypto.id,
          title: `${payout.crypto.assetLabel ?? 'Crypto'} · ${payout.crypto.addressMasked ?? ''}`.trim(),
          subtitle: 'Crypto Wallet',
          type: 'crypto',
          badge: 'CRYPTO',
          isDefault: payout.crypto.isDefault,
        });
      }
      setAccounts(next);
      setSelectedId(next.find((a) => a.isDefault)?.id ?? next[0]?.id ?? null);
    } catch (error) {
      alertError(error, 'Could not load payout accounts');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const isEmpty = !loading && accounts.length === 0;

  if (!loading && !poolName) {
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
            Select one of your saved accounts below. Pool payouts and returns will be credited here.
          </Text>
        </View>

        {loading ? (
          <View className="items-center py-10">
            <ActivityIndicator color="#C4A015" />
          </View>
        ) : isEmpty ? (
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
          disabled={isEmpty || !selectedId || loading}
          label="Next"
          onPress={() => router.push(`/pool/payment/${id}` as Href)}
        />
      </View>
    </View>
  );
}

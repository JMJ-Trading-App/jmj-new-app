import { useFocusEffect } from 'expo-router';
import { router, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { EmptyActivityIcon } from '@/components/home/home-icons';
import { InfoCircleIcon } from '@/components/invest/invest-flow-icons';
import { InvestFlowShell } from '@/components/invest/invest-flow-shell';
import { PayoutAccountCard } from '@/components/invest/payout-account-card';
import type { PayoutAccount } from '@/constants/invest-flow-data';
import { alertError } from '@/lib/errors';
import { getInvestDraft, setInvestPayoutAccountId } from '@/lib/invest-draft';
import { fetchPayoutAccounts } from '@/lib/payout';

export default function PayoutAccountScreen() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<PayoutAccount[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    getInvestDraft().payoutAccountId,
  );

  const load = useCallback(async () => {
    try {
      const result = await fetchPayoutAccounts();
      const next: PayoutAccount[] = [];
      if (result.bank) {
        next.push({
          id: result.bank.id,
          title: `${result.bank.bankName ?? 'Bank'} ${result.bank.accountMasked ?? ''}`.trim(),
          subtitle: 'Naira Payout',
          type: 'bank',
          badge: result.bank.isDefault ? 'DEFAULT' : undefined,
          isDefault: result.bank.isDefault,
        });
      }
      if (result.crypto) {
        next.push({
          id: result.crypto.id,
          title: `${result.crypto.assetLabel ?? 'Crypto'} · ${result.crypto.addressMasked ?? ''}`.trim(),
          subtitle: 'Crypto Wallet',
          type: 'crypto',
          badge: 'CRYPTO',
          isDefault: result.crypto.isDefault,
        });
      }
      setAccounts(next);
      setSelectedId((current) => {
        if (current && next.some((account) => account.id === current)) return current;
        return next.find((account) => account.isDefault)?.id ?? next[0]?.id ?? null;
      });
    } catch (error) {
      alertError(error, 'Could not load payout accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const isEmpty = !loading && accounts.length === 0;

  return (
    <InvestFlowShell
      title="Payout Account"
      step={2}
      nextDisabled={isEmpty || !selectedId || loading}
      onNext={() => {
        setInvestPayoutAccountId(selectedId);
        router.push('/invest/deposit-returns' as Href);
      }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-6 pt-6"
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
    </InvestFlowShell>
  );
}

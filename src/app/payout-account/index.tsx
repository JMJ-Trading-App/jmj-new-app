import { useFocusEffect } from 'expo-router';
import { router, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { PayoutFlowShell } from '@/components/payout/payout-flow-shell';
import {
  PayoutHubBankCard,
  PayoutHubCryptoCard,
} from '@/components/payout/payout-hub-cards';
import { CRYPTO_HUB_SUBTITLE } from '@/constants/payout-account-data';
import { alertError } from '@/lib/errors';
import {
  fetchPayoutAccounts,
  type BankPayoutAccount,
  type CryptoPayoutAccount,
} from '@/lib/payout';

export default function PayoutAccountsHubScreen() {
  const [loading, setLoading] = useState(true);
  const [bank, setBank] = useState<BankPayoutAccount | null>(null);
  const [crypto, setCrypto] = useState<CryptoPayoutAccount | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        try {
          const accounts = await fetchPayoutAccounts();
          if (!active) return;
          setBank(accounts.bank);
          setCrypto(accounts.crypto);
        } catch (error) {
          if (active) alertError(error, 'Could not load payout accounts');
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const bankDetail = bank
    ? `${bank.bankName} · ${bank.accountMasked} · ${bank.accountName}`
    : undefined;

  const cryptoDetail = crypto
    ? `${crypto.assetLabel} · ${crypto.addressMasked}`
    : CRYPTO_HUB_SUBTITLE;

  return (
    <PayoutFlowShell
      title="Add Payout Account"
      submitLabel="Done"
      onSubmit={() => router.back()}>
      <View className="gap-3">
        <Text className="font-geist-bold text-[24px] leading-[30px] text-stone-title">
          Your payout accounts
        </Text>
        <Text className="font-geist text-[14px] leading-[20px] text-stone-body">
          Configure how you receive automated capital distributions and earned investment returns.
        </Text>
      </View>

      {loading ? (
        <View className="items-center py-10">
          <ActivityIndicator color="#C4A015" />
        </View>
      ) : (
        <View className="gap-3">
          <PayoutHubBankCard
            added={Boolean(bank)}
            detail={bankDetail}
            onAdd={() => router.push('/payout-account/bank' as Href)}
          />

          <PayoutHubCryptoCard
            added={Boolean(crypto)}
            detail={cryptoDetail}
            onAdd={() => router.push('/payout-account/crypto' as Href)}
          />
        </View>
      )}
    </PayoutFlowShell>
  );
}

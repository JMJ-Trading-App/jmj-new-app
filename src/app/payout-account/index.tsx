import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { PayoutFlowShell } from '@/components/payout/payout-flow-shell';
import {
  PayoutHubBankCard,
  PayoutHubCryptoCard,
} from '@/components/payout/payout-hub-cards';
import {
  CRYPTO_HUB_SUBTITLE,
  DEFAULT_LINKED_BANK,
} from '@/constants/payout-account-data';
import { getSignupFirstName } from '@/lib/mock-auth';

export default function PayoutAccountsHubScreen() {
  // Mock: bank is already linked after the add flow (matches design).
  const [bankAdded] = useState(true);
  const [cryptoAdded] = useState(false);

  const accountName = getSignupFirstName() || DEFAULT_LINKED_BANK.accountName;
  const bankDetail = `${DEFAULT_LINKED_BANK.bankName} · ${DEFAULT_LINKED_BANK.accountMasked} · ${accountName}`;

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

      <View className="gap-3">
        <PayoutHubBankCard
          added={bankAdded}
          detail={bankDetail}
          onAdd={() => router.push('/payout-account/bank' as Href)}
        />

        <PayoutHubCryptoCard
          added={cryptoAdded}
          detail={CRYPTO_HUB_SUBTITLE}
          onAdd={() => router.push('/payout-account/crypto' as Href)}
        />
      </View>
    </PayoutFlowShell>
  );
}

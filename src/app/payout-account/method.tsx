import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { PayoutFlowShell } from '@/components/payout/payout-flow-shell';
import { PayoutMethodCard } from '@/components/payout/payout-method-card';
import {
  PAYOUT_METHODS,
  type PayoutMethodId,
} from '@/constants/payout-account-data';

export default function ChoosePayoutMethodScreen() {
  const [selectedId, setSelectedId] = useState<PayoutMethodId>('bank');

  function handleContinue() {
    if (selectedId === 'bank') {
      router.push('/payout-account/bank' as Href);
      return;
    }

    router.push('/payout-account/crypto' as Href);
  }

  return (
    <PayoutFlowShell title="Add Payout Account" onSubmit={handleContinue} submitLabel="Continue">
      <View className="gap-3">
        <Text className="font-geist-bold text-[24px] leading-[30px] text-stone-title">
          Choose payout method
        </Text>
        <Text className="font-geist text-[14px] leading-[20px] text-stone-body">
          Configure your preferred channel to receive your capital and investment profits
          automatically.
        </Text>
      </View>

      <View className="gap-3">
        {PAYOUT_METHODS.map((method) => (
          <PayoutMethodCard
            key={method.id}
            method={method}
            selected={selectedId === method.id}
            onPress={() => setSelectedId(method.id)}
          />
        ))}
      </View>
    </PayoutFlowShell>
  );
}

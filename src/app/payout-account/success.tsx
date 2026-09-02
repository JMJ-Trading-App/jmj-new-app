import { router, useLocalSearchParams, type Href } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SuccessCheckBadge } from '@/components/invest/invest-flow-icons';
import { PayoutSuccessSummaryCard } from '@/components/payout/payout-hub-cards';
import { Button } from '@/components/ui/button';
import { DEFAULT_LINKED_BANK } from '@/constants/payout-account-data';

export default function PayoutAccountSuccessScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    type?: string;
    bankName?: string;
    accountMasked?: string;
    methodLabel?: string;
    assetLabel?: string;
    addressMasked?: string;
  }>();

  const isCrypto = params.type === 'crypto';

  const subtitle = isCrypto
    ? 'Your crypto wallet has been securely linked for optional payouts.'
    : 'Your bank account has been securely linked as your default payout channel.';

  const rows = isCrypto
    ? [
        { label: 'METHOD', value: 'Crypto Wallet' },
        { label: 'ASSET', value: params.assetLabel ?? 'USDT (TRC20)' },
        { label: 'ADDRESS', value: params.addressMasked ?? '····' },
      ]
    : [
        {
          label: 'METHOD',
          value: params.methodLabel ?? DEFAULT_LINKED_BANK.methodLabel,
        },
        {
          label: 'BANK NAME',
          value: params.bankName ?? DEFAULT_LINKED_BANK.bankName,
        },
        {
          label: 'ACCOUNT',
          value: params.accountMasked ?? DEFAULT_LINKED_BANK.accountMasked,
        },
      ];

  function handleDone() {
    router.dismissTo('/payout-account' as Href);
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow items-center justify-center gap-5 px-5 pb-6"
        contentContainerStyle={{ paddingTop: insets.top + 24 }}
        showsVerticalScrollIndicator={false}>
        <SuccessCheckBadge />

        <View className="items-center gap-3">
          <Text className="text-center font-geist-bold text-[24px] leading-[32px] text-stone-title">
            Payout Account Added
          </Text>
          <Text className="text-center font-geist text-[15px] leading-[22px] text-stone-body">
            {subtitle}
          </Text>
        </View>

        <PayoutSuccessSummaryCard rows={rows} />
      </ScrollView>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button label="Done" onPress={handleDone} />
      </View>
    </View>
  );
}

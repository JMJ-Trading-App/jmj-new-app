import { Pressable, Text, View } from 'react-native';

import {
  BankCoinsIcon,
  RadioCheckIcon,
  WalletIcon,
} from '@/components/invest/invest-flow-icons';
import type { PayoutAccount } from '@/constants/invest-flow-data';
import { cn } from '@/lib/cn';

type PayoutAccountCardProps = {
  account: PayoutAccount;
  selected: boolean;
  onPress: () => void;
};

export function PayoutAccountCard({ account, selected, onPress }: PayoutAccountCardProps) {
  const isCrypto = account.type === 'crypto';

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 rounded-[18px] border px-4 py-4',
        selected ? 'border-[#E8C84A] bg-[#FBF6E4]' : 'border-[#E5E7EB] bg-white',
      )}
      style={({ pressed }) => [pressed && { opacity: 0.92 }]}>
      <View
        className={cn(
          'h-12 w-12 items-center justify-center rounded-[14px] border',
          selected ? 'border-[#F0E2A8] bg-white' : 'border-[#E5E7EB] bg-[#F3F4F6]',
        )}>
        {isCrypto ? (
          <WalletIcon color={selected ? '#57534E' : '#78716C'} />
        ) : (
          <BankCoinsIcon color={selected ? '#C4A015' : '#A8A29E'} />
        )}
      </View>

      <View className="min-w-0 flex-1 gap-1">
        <Text
          className={cn(
            'font-geist-bold text-[15px]',
            selected ? 'text-[#8A6D10]' : 'text-stone-title',
          )}
          numberOfLines={1}>
          {account.title}
        </Text>

        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="font-geist text-[13px] text-muted">{account.subtitle}</Text>
          {account.badge ? (
            <View
              className={cn(
                'rounded-md px-1.5 py-0.5',
                isCrypto ? 'bg-[#DBEAFE]' : 'bg-[#F5E8B0]',
              )}>
              <Text
                className={cn(
                  'font-geist-semibold text-[10px] tracking-wide',
                  isCrypto ? 'text-[#1D4ED8]' : 'text-[#8A6D10]',
                )}>
                {account.badge}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <RadioCheckIcon selected={selected} />
    </Pressable>
  );
}

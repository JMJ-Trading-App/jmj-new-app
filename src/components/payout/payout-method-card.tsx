import { Pressable, Text, View } from 'react-native';

import {
  BankCoinsIcon,
  RadioCheckIcon,
  WalletIcon,
} from '@/components/invest/invest-flow-icons';
import type { PayoutMethodOption } from '@/constants/payout-account-data';
import { cn } from '@/lib/cn';

type PayoutMethodCardProps = {
  method: PayoutMethodOption;
  selected: boolean;
  onPress: () => void;
};

export function PayoutMethodCard({ method, selected, onPress }: PayoutMethodCardProps) {
  const isCrypto = method.id === 'crypto';

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
          'h-12 w-12 items-center justify-center rounded-[14px]',
          selected ? 'bg-white' : 'bg-[#F3F4F6]',
        )}>
        {isCrypto ? (
          <WalletIcon color={selected ? '#57534E' : '#A8A29E'} />
        ) : (
          <BankCoinsIcon color={selected ? '#C4A015' : '#A8A29E'} />
        )}
      </View>

      <View className="min-w-0 flex-1 gap-1">
        <Text className="font-geist-bold text-[15px] text-stone-title" numberOfLines={1}>
          {method.title}
        </Text>

        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="font-geist text-[13px] text-muted">{method.subtitle}</Text>
          <View className="rounded-md bg-[#9CA3AF] px-1.5 py-0.5">
            <Text className="font-geist-semibold text-[10px] tracking-wide text-white">
              {method.badge}
            </Text>
          </View>
        </View>
      </View>

      <RadioCheckIcon selected={selected} />
    </Pressable>
  );
}

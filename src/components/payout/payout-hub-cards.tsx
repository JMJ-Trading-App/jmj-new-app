import { Pressable, Text, View } from 'react-native';

import {
  BankCoinsIcon,
  WalletIcon,
} from '@/components/invest/invest-flow-icons';
import { cn } from '@/lib/cn';

type PayoutHubBankCardProps = {
  added: boolean;
  detail?: string;
  onAdd?: () => void;
};

export function PayoutHubBankCard({ added, detail, onAdd }: PayoutHubBankCardProps) {
  if (added) {
    return (
      <View className="flex-row items-center gap-3 rounded-[18px] border border-[#16A34A] bg-[#F0FDF4] px-4 py-4">
        <View className="h-12 w-12 items-center justify-center rounded-[14px] bg-[#F3F4F6]">
          <BankCoinsIcon color="#16A34A" />
        </View>

        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="font-geist-bold text-[15px] text-[#166534]">
              Bank Account (Naira)
            </Text>
            <View className="rounded-md bg-[#16A34A] px-1.5 py-0.5">
              <Text className="font-geist-semibold text-[10px] tracking-wide text-white">ADDED</Text>
            </View>
          </View>
          {detail ? (
            <Text className="font-geist text-[13px] text-muted" numberOfLines={1}>
              {detail}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-3 rounded-[18px] border border-[#E5E7EB] bg-white px-4 py-4">
      <View className="h-12 w-12 items-center justify-center rounded-[14px] bg-[#F3F4F6]">
        <BankCoinsIcon color="#A8A29E" />
      </View>

      <View className="min-w-0 flex-1 gap-1">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="font-geist-bold text-[15px] text-stone-title">Bank Account (Naira)</Text>
          <View className="rounded-md bg-[#E5E7EB] px-1.5 py-0.5">
            <Text className="font-geist-semibold text-[10px] tracking-wide text-[#57534E]">
              REQUIRED
            </Text>
          </View>
        </View>
        <Text className="font-geist text-[13px] text-muted">Local Bank Payouts</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add bank account"
        onPress={onAdd}
        className="rounded-[10px] bg-[#F3F4F6] px-3.5 py-2"
        style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
        <Text className="font-geist-semibold text-[13px] text-stone-title">Add</Text>
      </Pressable>
    </View>
  );
}

type PayoutHubCryptoCardProps = {
  added: boolean;
  detail: string;
  onAdd?: () => void;
};

export function PayoutHubCryptoCard({ added, detail, onAdd }: PayoutHubCryptoCardProps) {
  if (added) {
    return (
      <View className="flex-row items-center gap-3 rounded-[18px] border border-[#16A34A] bg-[#F0FDF4] px-4 py-4">
        <View className="h-12 w-12 items-center justify-center rounded-[14px] bg-[#F3F4F6]">
          <WalletIcon color="#16A34A" />
        </View>

        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="font-geist-bold text-[15px] text-[#166534]">Crypto Wallet</Text>
            <View className="rounded-md bg-[#16A34A] px-1.5 py-0.5">
              <Text className="font-geist-semibold text-[10px] tracking-wide text-white">ADDED</Text>
            </View>
          </View>
          <Text className="font-geist text-[13px] text-muted" numberOfLines={1}>
            {detail}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-3 rounded-[18px] border border-[#E5E7EB] bg-white px-4 py-4">
      <View className="h-12 w-12 items-center justify-center rounded-[14px] bg-[#F3F4F6]">
        <WalletIcon color="#78716C" />
      </View>

      <View className="min-w-0 flex-1 gap-1">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="font-geist-bold text-[15px] text-stone-title">Crypto Wallet</Text>
          <View className="rounded-md bg-[#E5E7EB] px-1.5 py-0.5">
            <Text className="font-geist-semibold text-[10px] tracking-wide text-[#57534E]">
              OPTIONAL
            </Text>
          </View>
        </View>
        <Text className="font-geist text-[13px] text-muted">{detail}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add crypto wallet"
        onPress={onAdd}
        className="rounded-[10px] bg-[#F3F4F6] px-3.5 py-2"
        style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
        <Text className="font-geist-semibold text-[13px] text-stone-title">Add</Text>
      </Pressable>
    </View>
  );
}

type SuccessDetailRow = {
  label: string;
  value: string;
};

type PayoutSuccessSummaryCardProps = {
  rows: SuccessDetailRow[];
};

export function PayoutSuccessSummaryCard({ rows }: PayoutSuccessSummaryCardProps) {
  return (
    <View className="w-full overflow-hidden rounded-[20px] bg-[#F5F5F5] px-4">
      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;

        return (
          <View
            key={row.label}
            className={cn(
              'flex-row items-center justify-between gap-3 py-4',
              !isLast && 'border-b border-[#E5E7EB]',
            )}>
            <Text className="font-geist-semibold text-[11px] tracking-[0.08em] text-muted">
              {row.label}
            </Text>
            <Text className="shrink font-geist-bold text-[14px] text-stone-title" numberOfLines={1}>
              {row.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

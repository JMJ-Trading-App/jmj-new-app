import { Text, View } from 'react-native';

import { formatUsd, getDepositProjection } from '@/constants/invest-flow-data';

type PaymentSummaryCardProps = {
  deposit: number;
};

export function PaymentSummaryCard({ deposit }: PaymentSummaryCardProps) {
  const { serviceCharge, totalToPay } = getDepositProjection(deposit);

  return (
    <View className="rounded-[18px] border border-[#E5E7EB] bg-white p-4">
      <Text className="font-geist-bold text-[16px] text-stone-title">Payment Summary</Text>

      <View className="mt-4 gap-3">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 flex-row flex-wrap items-center gap-2">
            <Text className="font-geist text-[14px] text-stone-body">Initial Deposit</Text>
            <View className="rounded-full bg-[#F3F4F6] px-2 py-0.5">
              <Text className="font-geist-semibold text-[10px] tracking-wide text-muted">
                YOUR CAPITAL
              </Text>
            </View>
          </View>
          <Text className="font-geist-semibold text-[14px] text-stone-title">
            {formatUsd(deposit)}
          </Text>
        </View>

        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 flex-row flex-wrap items-center gap-2">
            <Text className="font-geist text-[14px] text-stone-body">Service Charge</Text>
            <View className="rounded-full bg-[#F5E8B0] px-2 py-0.5">
              <Text className="font-geist-semibold text-[10px] tracking-wide text-[#8A6D10]">
                2.5%
              </Text>
            </View>
          </View>
          <Text className="font-geist-semibold text-[14px] text-stone-title">
            {formatUsd(serviceCharge)}
          </Text>
        </View>
      </View>

      <View className="my-4 h-px bg-[#EFEFEF]" />

      <View className="flex-row items-center justify-between gap-3">
        <Text className="font-geist-bold text-[15px] text-[#C4A015]">Total to Pay</Text>
        <Text className="font-geist-bold text-[16px] text-[#C4A015]">{formatUsd(totalToPay)}</Text>
      </View>

      <Text className="mt-3 font-geist text-[12px] leading-[17px] text-muted">
        You only pay the 2.5% service charge. Your capital is invested and returns are sent to your
        balance.
      </Text>
    </View>
  );
}

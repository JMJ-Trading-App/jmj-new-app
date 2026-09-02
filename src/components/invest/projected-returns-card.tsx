import { Pressable, Text, View } from 'react-native';

import { HandTapIcon } from '@/components/home/home-icons';
import { ChevronRightSmallIcon } from '@/components/invest/invest-flow-icons';
import { formatUsd, getDepositProjection } from '@/constants/invest-flow-data';
import { cn } from '@/lib/cn';

type ProjectedReturnsCardProps = {
  deposit: number;
  expanded: boolean;
  onToggle: () => void;
};

function Row({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text className="flex-1 font-geist text-[14px] text-stone-body">{label}</Text>
      <Text className={cn('font-geist-semibold text-[14px] text-stone-title', valueClassName)}>
        {value}
      </Text>
    </View>
  );
}

export function ProjectedReturnsCard({ deposit, expanded, onToggle }: ProjectedReturnsCardProps) {
  const projection = getDepositProjection(deposit);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      onPress={onToggle}
      className="rounded-[18px] bg-[#FBF6E4] p-4"
      style={({ pressed }) => [pressed && { opacity: 0.94 }]}>
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 font-geist-semibold text-[14px] text-[#C4A015]">
          Projected Returns (150% Profit Target)
        </Text>
        <View style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}>
          <ChevronRightSmallIcon color="#C4A015" />
        </View>
      </View>

      {expanded ? (
        <View className="mt-4 gap-3">
          <Row label="Your Deposit" value={formatUsd(projection.deposit)} />
          <Row
            label="Projected Profit (150%)"
            value={`+${formatUsd(projection.projectedProfit)}`}
            valueClassName="text-success"
          />
          <Row label="Equity at Maturity" value={formatUsd(projection.equityAtMaturity)} />

          <View className="h-px bg-[#E8D9A8]" />

          <Row
            label="Your share (55%)"
            value={`+${formatUsd(projection.yourShare)}`}
            valueClassName="text-success"
          />

          <View className="h-px bg-[#E8D9A8]" />

          <View className="flex-row items-center justify-between gap-3">
            <Text className="flex-1 font-geist-medium text-[14px] text-stone-title">
              Take-home in your balance
            </Text>
            <Text className="font-geist-bold text-[16px] text-success">
              {formatUsd(projection.takeHome)}
            </Text>
          </View>

          <Text className="font-geist text-[12px] text-muted">
            * Past performance does not guarantee future results.
          </Text>

          <View className="mt-1 flex-row items-center gap-1.5">
            <HandTapIcon color="#A8A29E" size={14} />
            <Text className="font-geist text-[12px] text-muted">Tap to close details</Text>
          </View>
        </View>
      ) : (
        <View className="mt-4 gap-3">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="flex-1 font-geist text-[14px] text-stone-body">
              Take-home in your balance
            </Text>
            <Text className="font-geist-bold text-[16px] text-success">
              {formatUsd(projection.takeHome)}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5">
            <HandTapIcon color="#A8A29E" size={14} />
            <Text className="font-geist text-[12px] text-muted">Tap to expand details</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

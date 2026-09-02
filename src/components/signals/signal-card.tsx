import { Pressable, Text, View } from 'react-native';

import { TrendDownIcon, TrendUpIcon } from '@/components/signals/signals-icons';
import { SignalPriceRows } from '@/components/signals/signal-price-rows';
import type { TradeSignal } from '@/constants/signals-data';
import { cn } from '@/lib/cn';

type SignalCardProps = {
  signal: TradeSignal;
  onPress?: () => void;
  compact?: boolean;
};

export function SignalSideBadge({ side }: { side: TradeSignal['side'] }) {
  const isBuy = side === 'buy';

  return (
    <View
      className={cn(
        'flex-row items-center gap-1 self-start rounded-md px-2 py-1',
        isBuy ? 'bg-[#DCFCE7]' : 'bg-[#FEE2E2]',
      )}>
      {isBuy ? <TrendUpIcon /> : <TrendDownIcon />}
      <Text
        className={cn(
          'font-geist-bold text-[11px] tracking-wide',
          isBuy ? 'text-[#16A34A]' : 'text-[#DC2626]',
        )}>
        {isBuy ? 'BUY' : 'SELL'}
      </Text>
    </View>
  );
}

export function SignalCard({ signal, onPress, compact = false }: SignalCardProps) {
  const isActive = signal.status === 'active';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${signal.asset} signal`}
      disabled={!onPress}
      onPress={onPress}
      className="gap-3 rounded-[18px] border border-[#E5E7EB] bg-white p-4"
      style={({ pressed }) => [pressed && onPress && { opacity: 0.94 }]}>
      <View className="flex-row items-start justify-between gap-3">
        <Text className="flex-1 font-geist-bold text-[16px] text-stone-title">{signal.asset}</Text>
        {isActive ? (
          <View className="flex-row items-center gap-1.5 rounded-full bg-brand px-2.5 py-1">
            <View className="h-1.5 w-1.5 rounded-full bg-stone-title" />
            <Text className="font-geist-semibold text-[11px] text-stone-title">Active</Text>
          </View>
        ) : (
          <View className="rounded-full bg-[#F3F4F6] px-2.5 py-1">
            <Text className="font-geist-semibold text-[11px] text-muted">
              {signal.status === 'hit_tp' ? 'Hit TP' : signal.status === 'hit_sl' ? 'Hit SL' : 'Closed'}
            </Text>
          </View>
        )}
      </View>

      <SignalSideBadge side={signal.side} />

      <SignalPriceRows
        entry={signal.entry}
        takeProfit={signal.takeProfit}
        stopLoss={signal.stopLoss}
      />

      {!compact && signal.note ? (
        <Text className="font-geist text-[13px] leading-[18px] text-stone-body">{signal.note}</Text>
      ) : null}

      <Text className="font-geist text-[12px] text-muted">{signal.releasedLabel}</Text>
    </Pressable>
  );
}

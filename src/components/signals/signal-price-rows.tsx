import { Text, View } from 'react-native';

type PriceAccent = 'none' | 'entry' | 'tp' | 'sl';

type SignalPriceRowProps = {
  label: string;
  value: string;
  accent?: PriceAccent;
};

export function SignalPriceRow({ label, value, accent = 'none' }: SignalPriceRowProps) {
  const accentClass =
    accent === 'tp' ? 'bg-[#22C55E]' : accent === 'sl' ? 'bg-[#EF4444]' : accent === 'entry' ? 'bg-[#D1D5DB]' : null;

  return (
    <View className="relative overflow-hidden rounded-[12px] bg-[#F3F4F6]">
      {accentClass ? (
        <View className={`absolute bottom-0 left-0 top-0 w-[4px] ${accentClass}`} />
      ) : null}
      <View className="flex-row items-center justify-between px-4 py-3.5">
        <Text className="font-geist text-[14px] text-stone-body">{label}</Text>
        <Text className="font-geist-bold text-[14px] text-stone-title">{value}</Text>
      </View>
    </View>
  );
}

type SignalPriceRowsProps = {
  entry: string;
  takeProfit: string;
  stopLoss: string;
  showEntryAccent?: boolean;
};

export function SignalPriceRows({
  entry,
  takeProfit,
  stopLoss,
  showEntryAccent = false,
}: SignalPriceRowsProps) {
  return (
    <View className="gap-2">
      <SignalPriceRow label="Entry" value={entry} accent={showEntryAccent ? 'entry' : 'none'} />
      <SignalPriceRow label="Take profit" value={takeProfit} accent="tp" />
      <SignalPriceRow label="Stop loss" value={stopLoss} accent="sl" />
    </View>
  );
}

import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SignalSideBadge } from '@/components/signals/signal-card';
import { SignalPriceRows } from '@/components/signals/signal-price-rows';
import { SignalProgressTimeline } from '@/components/signals/signal-progress-timeline';
import { Button } from '@/components/ui/button';
import { getSignalById } from '@/constants/signals-data';

export default function SignalDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const signal = getSignalById(id ?? '');

  if (!signal) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5">
        <Text className="font-geist-bold text-base text-stone-title">Signal not found</Text>
        <Pressable className="mt-4" onPress={() => router.back()}>
          <Text className="font-geist-medium text-muted">Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-2 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            Signals
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-5 pb-6 pt-4"
        showsVerticalScrollIndicator={false}>
        <View className="items-center gap-3">
          <Text className="text-center font-geist-bold text-[24px] leading-[30px] text-stone-title">
            {signal.asset}
          </Text>
          <SignalSideBadge side={signal.side} />
        </View>

        <SignalPriceRows
          entry={signal.entry}
          takeProfit={signal.takeProfit}
          stopLoss={signal.stopLoss}
          showEntryAccent
        />

        <View className="rounded-[18px] border border-[#EFEFEF] bg-white px-4 py-4">
          <Text className="mb-2 font-geist-semibold text-[11px] tracking-[0.08em] text-muted">
            WHAT THIS MEANS
          </Text>
          <Text className="font-geist text-[14px] leading-[20px] text-stone-body">
            {signal.meaning}
          </Text>
        </View>

        <SignalProgressTimeline steps={signal.progress} />
      </ScrollView>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button label="Go back" onPress={() => router.back()} />
      </View>
    </View>
  );
}

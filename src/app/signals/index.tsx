import { BlurView } from 'expo-blur';
import { router, useFocusEffect, useLocalSearchParams, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SignalCard } from '@/components/signals/signal-card';
import { SignalsAccessEnded } from '@/components/signals/signals-access-ended';
import { SignalsFilterTabs } from '@/components/signals/signals-filter-tabs';
import { LightbulbIcon } from '@/components/signals/signals-icons';
import { SignalsPlanBanner } from '@/components/signals/signals-plan-banner';
import { Button } from '@/components/ui/button';
import {
  type SignalsAccessStatus,
  type SignalsTab,
  type TradeSignal,
} from '@/constants/signals-data';
import type { TradeSignalApi } from '@/lib/api/types';
import { alertError } from '@/lib/errors';
import { fetchSignals } from '@/lib/signals';

function mapSignal(signal: TradeSignalApi): TradeSignal {
  return {
    id: signal.id,
    asset: signal.asset,
    side: signal.side,
    status: signal.status,
    entry: signal.entry,
    takeProfit: signal.takeProfit,
    stopLoss: signal.stopLoss,
    note: signal.note,
    meaning: signal.meaning,
    releasedLabel: signal.releasedLabel,
    progress: signal.progress,
  };
}

export default function SignalsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ status?: string }>();
  const [tab, setTab] = useState<SignalsTab>('active');
  const [loading, setLoading] = useState(true);
  const [accessStatus, setAccessStatus] = useState<SignalsAccessStatus>('ended');
  const [planSummary, setPlanSummary] = useState<string | null>(null);
  const [insight, setInsight] = useState({ hit: 0, total: 0 });
  const [active, setActive] = useState<TradeSignal[]>([]);
  const [history, setHistory] = useState<TradeSignal[]>([]);

  const load = useCallback(async () => {
    try {
      const result = await fetchSignals();
      const forced =
        params.status === 'ended' || params.status === 'active'
          ? params.status
          : null;
      setAccessStatus(forced ?? result.access);
      setPlanSummary(result.plan?.summary ?? null);
      setInsight({ hit: result.insight.hit, total: result.insight.total });
      setActive(result.active.map(mapSignal));
      setHistory(result.history.map(mapSignal));
    } catch (error) {
      alertError(error, 'Could not load signals');
    } finally {
      setLoading(false);
    }
  }, [params.status]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const isAccessActive = accessStatus === 'active';
  const signals = useMemo(
    () => (tab === 'active' ? active : history),
    [tab, active, history],
  );

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

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#C4A015" />
        </View>
      ) : isAccessActive ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-5 px-5 pb-6 pt-2"
          showsVerticalScrollIndicator={false}>
          <SignalsPlanBanner
            summary={planSummary ?? undefined}
            onManage={() => router.push('/signals/plan' as Href)}
          />

          <View className="flex-row items-center gap-2">
            <LightbulbIcon />
            <Text className="flex-1 font-geist text-[13px] text-stone-body">
              <Text className="font-geist-bold text-stone-title">
                {insight.hit} of {insight.total}
              </Text>{' '}
              signals hit target this month.
            </Text>
          </View>

          <SignalsFilterTabs value={tab} onChange={setTab} />

          <View className="gap-3">
            {signals.map((signal) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                onPress={() => router.push(`/signals/${signal.id}` as Href)}
              />
            ))}

            {signals.length === 0 ? (
              <View className="items-center py-12">
                <Text className="font-geist-medium text-[14px] text-muted">No signals yet</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      ) : (
        <>
          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-8 px-5 pb-6 pt-4"
            showsVerticalScrollIndicator={false}>
            <SignalsAccessEnded onSeePlans={() => router.push('/signals/plan' as Href)} />

            <View className="relative overflow-hidden">
              <View
                pointerEvents="none"
                className="gap-3"
                style={
                  Platform.OS === 'web'
                    ? ({ filter: 'blur(7px)' } as object)
                    : undefined
                }>
                {active.slice(0, 2).map((signal) => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
              </View>

              {Platform.OS !== 'web' ? (
                <>
                  <BlurView
                    intensity={42}
                    tint="light"
                    pointerEvents="none"
                    style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                  />
                  <View pointerEvents="none" className="absolute inset-0 bg-white/25" />
                </>
              ) : (
                <View pointerEvents="none" className="absolute inset-0 bg-white/30" />
              )}
            </View>
          </ScrollView>

          <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
            <Button label="Go back" onPress={() => router.back()} />
          </View>
        </>
      )}
    </View>
  );
}

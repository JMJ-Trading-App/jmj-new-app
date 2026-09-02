import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SignalCard } from '@/components/signals/signal-card';
import { SignalsAccessEnded } from '@/components/signals/signals-access-ended';
import { SignalsFilterTabs } from '@/components/signals/signals-filter-tabs';
import { LightbulbIcon } from '@/components/signals/signals-icons';
import { SignalsPlanBanner } from '@/components/signals/signals-plan-banner';
import { Button } from '@/components/ui/button';
import {
  ACTIVE_SIGNALS,
  HISTORY_SIGNALS,
  SIGNALS_ACCESS_STATUS,
  SIGNALS_INSIGHT,
  type SignalsAccessStatus,
  type SignalsTab,
} from '@/constants/signals-data';

export default function SignalsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ status?: string }>();
  const [tab, setTab] = useState<SignalsTab>('active');

  const accessStatus: SignalsAccessStatus =
    params.status === 'ended' || params.status === 'active'
      ? params.status
      : SIGNALS_ACCESS_STATUS;

  const isAccessActive = accessStatus === 'active';

  const signals = useMemo(
    () => (tab === 'active' ? ACTIVE_SIGNALS : HISTORY_SIGNALS),
    [tab],
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

      {isAccessActive ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-5 px-5 pb-6 pt-2"
          showsVerticalScrollIndicator={false}>
          <SignalsPlanBanner onManage={() => router.push('/signals/plan' as Href)} />

          <View className="flex-row items-center gap-2">
            <LightbulbIcon />
            <Text className="flex-1 font-geist text-[13px] text-stone-body">
              <Text className="font-geist-bold text-stone-title">
                {SIGNALS_INSIGHT.hit} of {SIGNALS_INSIGHT.total}
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
                {ACTIVE_SIGNALS.map((signal) => (
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
                  <View
                    pointerEvents="none"
                    className="absolute inset-0 bg-white/25"
                  />
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

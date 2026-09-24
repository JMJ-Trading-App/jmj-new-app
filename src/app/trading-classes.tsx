import { router, useFocusEffect, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UpgradeBanner } from '@/components/more/upgrade-banner';
import { TradingClassCard } from '@/components/trading-classes/trading-class-card';
import { SearchIcon } from '@/components/trading-classes/trading-classes-icons';
import {
  type ClassAction,
  type TradingClass,
} from '@/constants/trading-classes-data';
import type { TradingClassApi } from '@/lib/api/types';
import { alertError, alertSuccess } from '@/lib/errors';
import { fetchClasses, toggleClassRemind } from '@/lib/classes';

function mapClass(item: TradingClassApi): TradingClass {
  return {
    id: item.id,
    platform: item.platform,
    status: item.status,
    tier: item.tier,
    title: item.title,
    description: item.description,
    schedule: item.schedule,
    action: item.action,
  };
}

export default function TradingClassesScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<TradingClass[]>([]);
  const [actions, setActions] = useState<Record<string, ClassAction>>({});
  const [joinUrls, setJoinUrls] = useState<Record<string, string | null>>({});

  const load = useCallback(async () => {
    try {
      const result = await fetchClasses();
      const mapped = result.classes.map(mapClass);
      setClasses(mapped);
      setActions(Object.fromEntries(mapped.map((item) => [item.id, item.action])));
      setJoinUrls(
        Object.fromEntries(
          result.classes.map((item) => [item.id, item.joinUrl ?? null]),
        ),
      );
    } catch (error) {
      alertError(error, 'Could not load classes');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return classes;

    return classes.filter((item) => {
      const haystack =
        `${item.title} ${item.platform} ${item.tier} ${item.description}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, classes]);

  async function handleAction(id: string, current: ClassAction) {
    if (current === 'join') {
      const url = joinUrls[id];
      if (url) {
        await Linking.openURL(url);
      } else {
        alertError(new Error('Join link unavailable for your plan.'), 'Upgrade needed');
      }
      return;
    }

    try {
      const result = await toggleClassRemind(id);
      setActions((prev) => ({ ...prev, [id]: result.action }));
      alertSuccess(result.message);
    } catch (error) {
      alertError(error, 'Could not update reminder');
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-4 flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="font-geist-bold text-[20px] text-stone-title">Trading Classes</Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#C4A015" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 px-5 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <UpgradeBanner onPress={() => router.push('/subscriptions?tab=classes' as Href)} />

          <View className="flex-row items-center gap-2.5 rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-3">
            <SearchIcon />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search classes, mentors..."
              placeholderTextColor="#9CA3AF"
              className="min-h-[22px] flex-1 p-0 font-geist text-[14px] text-stone-title"
              style={{ fontSize: 14, lineHeight: undefined, paddingVertical: 0 }}
            />
          </View>

          <View className="gap-3">
            {filtered.map((item) => (
              <TradingClassCard
                key={item.id}
                item={item}
                action={actions[item.id] ?? item.action}
                onActionPress={() =>
                  void handleAction(item.id, actions[item.id] ?? item.action)
                }
              />
            ))}

            {filtered.length === 0 ? (
              <View className="items-center py-12">
                <Text className="font-geist-medium text-[14px] text-muted">No classes found</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

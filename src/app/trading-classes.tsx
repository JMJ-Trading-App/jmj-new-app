import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UpgradeBanner } from '@/components/more/upgrade-banner';
import { TradingClassCard } from '@/components/trading-classes/trading-class-card';
import { SearchIcon } from '@/components/trading-classes/trading-classes-icons';
import {
  TRADING_CLASSES,
  type ClassAction,
} from '@/constants/trading-classes-data';

export default function TradingClassesScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [actions, setActions] = useState<Record<string, ClassAction>>(() =>
    Object.fromEntries(TRADING_CLASSES.map((item) => [item.id, item.action])),
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return TRADING_CLASSES;

    return TRADING_CLASSES.filter((item) => {
      const haystack = `${item.title} ${item.platform} ${item.tier} ${item.description}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query]);

  function handleAction(id: string, current: ClassAction) {
    if (current === 'join') return;

    setActions((prev) => ({
      ...prev,
      [id]: current === 'remind' ? 'reminded' : 'remind',
    }));
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
              onActionPress={() => handleAction(item.id, actions[item.id] ?? item.action)}
            />
          ))}

          {filtered.length === 0 ? (
            <View className="items-center py-12">
              <Text className="font-geist-medium text-[14px] text-muted">No classes found</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

import { router, useFocusEffect, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RecentActivities } from '@/components/home/recent-activities';
import { cn } from '@/lib/cn';
import { fetchRecentActivity, type ActivityItem } from '@/lib/activity';
import { alertError } from '@/lib/errors';
import { REFRESH_CONTROL_PROPS } from '@/constants/refresh';

const FILTERS = [
  { id: 'all' as const, label: 'All' },
  { id: 'metatrader' as const, label: 'MetaTrader' },
];

type FilterId = (typeof FILTERS)[number]['id'];

function applyFilter(items: ActivityItem[], filter: FilterId) {
  if (filter === 'metatrader') {
    return items.filter((item) => item.category === 'metatrader');
  }
  return items;
}

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterId>('all');
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const filterRef = useRef(filter);
  const requestIdRef = useRef(0);
  const skipFilterFetchRef = useRef(true);

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  const load = useCallback(async (nextFilter: FilterId, opts?: { quiet?: boolean }) => {
    const requestId = ++requestIdRef.current;
    if (!opts?.quiet) setLoading(true);
    try {
      const result = await fetchRecentActivity(50, nextFilter);
      // Drop stale responses so an older "All" fetch can't overwrite MetaTrader.
      if (requestId !== requestIdRef.current || filterRef.current !== nextFilter) {
        return;
      }
      setItems(applyFilter(result.activities, nextFilter));
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      alertError(error, 'Could not load activity');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load(filterRef.current);
    }, [load]),
  );

  useEffect(() => {
    setItems((prev) => applyFilter(prev, filter));
    if (skipFilterFetchRef.current) {
      skipFilterFetchRef.current = false;
      return;
    }
    void load(filter);
  }, [filter, load]);

  function openItem(item: ActivityItem) {
    if (item.href) {
      router.push(item.href as Href);
    }
  }

  const showInitialLoading = loading && items.length === 0;

  return (
    <View className="flex-1 bg-white">
      <View
        className="border-b border-[#F3F4F6] px-5 pb-4"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>

          <Text className="font-geist-bold text-lg text-stone-title">Activity</Text>

          <View className="h-10 w-10" />
        </View>

        <View className="flex-row gap-2">
          {FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => {
                  if (item.id === filter) return;
                  setFilter(item.id);
                }}
                className={cn(
                  'rounded-full px-4 py-2',
                  active ? 'bg-[#F5E8B0]' : 'bg-[#F3F4F6]',
                )}>
                <Text
                  className={cn(
                    'font-geist-semibold text-[13px]',
                    active ? 'text-stone-title' : 'text-muted',
                  )}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {showInitialLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#C4A015" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-5 px-5 pb-10 pt-5"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void load(filterRef.current, { quiet: true });
              }}
              {...REFRESH_CONTROL_PROPS}
            />
          }>
          {loading ? (
            <View className="items-center py-2">
              <ActivityIndicator color="#C4A015" />
            </View>
          ) : null}
          <RecentActivities
            activities={items}
            hideViewAll
            title={filter === 'metatrader' ? 'MetaTrader activity' : 'All activity'}
            onItemPress={openItem}
          />
        </ScrollView>
      )}
    </View>
  );
}

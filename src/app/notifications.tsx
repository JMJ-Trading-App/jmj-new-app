import { router, useFocusEffect, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  NotificationFilterChips,
  NotificationRow,
} from '@/components/notifications/notification-list';
import {
  NOTIFICATION_FILTERS,
  NOTIFICATION_SECTIONS,
  type NotificationFilterId,
  type NotificationItem,
} from '@/constants/notifications-data';
import { REFRESH_CONTROL_PROPS } from '@/constants/refresh';
import type { NotificationItemApi } from '@/lib/api/types';
import { alertError } from '@/lib/errors';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/notifications';

function mapItem(item: NotificationItemApi): NotificationItem {
  return {
    id: item.id,
    title: item.title,
    body: item.body,
    time: item.time,
    category: item.category,
    unread: item.unread,
    icon: item.icon,
    section: item.section,
    href: item.href,
  };
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<NotificationFilterId>('all');
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<NotificationItem | null>(null);

  const load = useCallback(async (opts?: { quiet?: boolean }) => {
    if (!opts?.quiet) setLoading(true);
    try {
      const result = await fetchNotifications();
      setItems(result.notifications.map(mapItem));
    } catch (error) {
      alertError(error, 'Could not load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const grouped = useMemo(() => {
    const filtered =
      filter === 'all' ? items : items.filter((item) => item.category === filter);

    return NOTIFICATION_SECTIONS.map((section) => ({
      ...section,
      items: filtered.filter((item) => item.section === section.id),
    })).filter((section) => section.items.length > 0);
  }, [filter, items]);

  async function markAllRead() {
    try {
      await markAllNotificationsRead();
      setItems((current) => current.map((item) => ({ ...item, unread: false })));
    } catch (error) {
      alertError(error, 'Could not mark all as read');
    }
  }

  async function openItem(item: NotificationItem) {
    if (item.unread) {
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, unread: false } : entry,
        ),
      );
      try {
        await markNotificationRead(item.id);
      } catch {
        void load({ quiet: true });
      }
    }
    setSelected(item);
  }

  function openSelected() {
    if (!selected?.href) return;
    const href = selected.href;
    setSelected(null);
    router.push(href as Href);
  }

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

          <View className="items-center">
            <Text className="font-geist-bold text-lg text-stone-title">Notifications</Text>
            <Text className="font-geist text-[11px] text-muted">
              {items.filter((item) => item.unread).length} unread
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => void markAllRead()}
            hitSlop={8}>
            <Text className="font-geist-medium text-[13px] text-[#8B7E55]">Mark all read</Text>
          </Pressable>
        </View>

        <NotificationFilterChips
          activeFilter={filter}
          filters={NOTIFICATION_FILTERS}
          onChange={(id) => setFilter(id as NotificationFilterId)}
        />
      </View>

      {loading && items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#C4A015" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-8"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void load({ quiet: true });
              }}
              {...REFRESH_CONTROL_PROPS}
            />
          }>
          {grouped.length === 0 ? (
            <View className="items-center gap-2 py-16">
              <Text className="font-geist-semibold text-base text-stone-title">
                No notifications
              </Text>
              <Text className="px-6 text-center font-geist text-sm text-muted">
                {filter === 'all'
                  ? 'Account, investment, and pool updates will stay in this history.'
                  : `No ${filter} notifications yet.`}
              </Text>
            </View>
          ) : (
            grouped.map((section) => (
              <View key={section.id} className="pt-5">
                <Text className="mb-1 font-geist-medium text-[11px] tracking-[0.8px] text-[#9CA3AF]">
                  {section.label}
                </Text>

                {section.items.map((item, index) => (
                  <View
                    key={item.id}
                    className={
                      index < section.items.length - 1 ? 'border-b border-[#F3F4F6]' : ''
                    }>
                    <NotificationRow
                      item={item}
                      onPress={(next) => void openItem(next)}
                    />
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}

      {selected ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => setSelected(null)}
          className="absolute inset-0 justify-end bg-black/40">
          <Pressable
            onPress={(event) => event.stopPropagation?.()}
            className="rounded-t-[24px] bg-white px-5 pt-5"
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
            <Text className="font-geist text-[12px] uppercase tracking-wide text-muted">
              {selected.category} · {selected.time}
            </Text>
            <Text className="mt-2 font-geist-bold text-[20px] text-stone-title">
              {selected.title}
            </Text>
            <Text className="mt-3 font-geist text-[15px] leading-[22px] text-stone-body">
              {selected.body}
            </Text>
            <View className="mt-5 flex-row gap-3">
              <Pressable
                onPress={() => setSelected(null)}
                className="flex-1 items-center rounded-[14px] bg-[#F3F4F6] py-3">
                <Text className="font-geist-semibold text-[15px] text-stone-title">Close</Text>
              </Pressable>
              {selected.href ? (
                <Pressable
                  onPress={openSelected}
                  className="flex-1 items-center rounded-[14px] bg-stone-title py-3">
                  <Text className="font-geist-semibold text-[15px] text-white">Open</Text>
                </Pressable>
              ) : null}
            </View>
          </Pressable>
        </Pressable>
      ) : null}
    </View>
  );
}

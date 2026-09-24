import { router, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
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
  };
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<NotificationFilterId>('all');
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const result = await fetchNotifications();
      setItems(result.notifications.map(mapItem));
    } catch (error) {
      alertError(error, 'Could not load notifications');
    } finally {
      setLoading(false);
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

  async function markOneRead(item: NotificationItem) {
    if (!item.unread) return;
    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, unread: false } : entry,
      ),
    );
    try {
      await markNotificationRead(item.id);
    } catch (error) {
      alertError(error, 'Could not mark as read');
      void load();
    }
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

          <Text className="font-geist-bold text-lg text-stone-title">Notifications</Text>

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

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#C4A015" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-8"
          showsVerticalScrollIndicator={false}>
          {grouped.length === 0 ? (
            <View className="items-center gap-2 py-16">
              <Text className="font-geist-semibold text-base text-stone-title">
                No notifications
              </Text>
              <Text className="font-geist text-sm text-muted">You’re all caught up.</Text>
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
                      onPress={(next) => void markOneRead(next)}
                    />
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

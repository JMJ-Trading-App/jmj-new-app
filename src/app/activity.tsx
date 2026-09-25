import { router, useFocusEffect, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
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
import { fetchRecentActivity, type ActivityItem } from '@/lib/activity';
import { alertError } from '@/lib/errors';
import { REFRESH_CONTROL_PROPS } from '@/constants/refresh';

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (opts?: { quiet?: boolean }) => {
    if (!opts?.quiet) setLoading(true);
    try {
      const result = await fetchRecentActivity(50);
      setItems(result.activities);
    } catch (error) {
      alertError(error, 'Could not load activity');
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

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-4 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            Recent Activity
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center py-16">
          <ActivityIndicator color="#C4A015" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-10"
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) + 16 }}
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
          <RecentActivities
            activities={items}
            hideViewAll
            title="MetaTrader activity"
            onItemPress={(item) => {
              if (item.href) router.push(item.href as Href);
            }}
          />
        </ScrollView>
      )}
    </View>
  );
}

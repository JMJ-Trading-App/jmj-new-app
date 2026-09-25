import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountBalanceCarousel } from '@/components/home/account-balance-card';
import { ExploreSection } from '@/components/home/explore-section';
import { HomeHeader } from '@/components/home/home-header';
import { RecentActivities } from '@/components/home/recent-activities';
import { SetupBanner } from '@/components/home/setup-banner';
import { HOME_ACCOUNTS } from '@/constants/home-data';
import type { ActivityItem } from '@/lib/activity';
import { BottomTabInset } from '@/constants/theme';
import { REFRESH_CONTROL_PROPS } from '@/constants/refresh';
import { useSession } from '@/hooks/use-session';
import {
  fetchAccountBalances,
  fetchRecentActivity,
  syncMetaTraderAccount,
  type AccountBalanceCard,
} from '@/lib/activity';
import { fetchUnreadNotificationCount } from '@/lib/notifications';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useSession();
  const firstName = user?.firstName?.trim() || 'there';
  const initials = user?.initials || 'JM';
  const [unreadCount, setUnreadCount] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [accounts, setAccounts] = useState<AccountBalanceCard[]>(HOME_ACCOUNTS);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (opts?: { syncMt?: boolean }) => {
    await refreshUser();
    if (opts?.syncMt) {
      await syncMetaTraderAccount().catch(() => null);
    }
    const [unread, activity, balances] = await Promise.all([
      fetchUnreadNotificationCount().catch(() => ({ unreadCount: 0 })),
      fetchRecentActivity(8).catch(() => ({ activities: [] as ActivityItem[] })),
      fetchAccountBalances().catch(() => ({ accounts: HOME_ACCOUNTS })),
    ]);
    setUnreadCount(unread.unreadCount);
    setActivities(activity.activities);
    if (balances.accounts?.length) {
      setAccounts(balances.accounts);
    }
    // Background refresh of MT balance/deals after first paint
    if (!opts?.syncMt) {
      void syncMetaTraderAccount()
        .then(() => fetchAccountBalances())
        .then((next) => {
          if (next.accounts?.length) setAccounts(next.accounts);
          return fetchRecentActivity(8);
        })
        .then((activityNext) => setActivities(activityNext.activities))
        .catch(() => null);
    }
  }, [refreshUser]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5"
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: BottomTabInset + 16,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void load({ syncMt: true }).finally(() => setRefreshing(false));
            }}
            {...REFRESH_CONTROL_PROPS}
          />
        }>
        <View className="px-5">
          <HomeHeader
            firstName={firstName}
            initials={initials}
            unreadCount={unreadCount}
            onNotificationsPress={() => router.push('/notifications')}
            onProfilePress={() => router.push('/profile' as Href)}
          />
        </View>

        <AccountBalanceCarousel accounts={accounts} />

        <View className="gap-5 px-5">
          <SetupBanner
            kycStatus={user?.kycStatus}
            onActionPress={(slideId) => {
              if (slideId === 'kyc') {
                router.push('/kyc' as Href);
              }
              if (slideId === 'funding') {
                router.push('/(tabs)/invest' as Href);
              }
              if (slideId === 'explore') {
                router.push('/signals' as Href);
              }
            }}
          />
          <ExploreSection
            onItemPress={(id) => {
              if (id === 'signals') {
                router.push('/signals' as Href);
              }
              if (id === 'classes') {
                router.push('/trading-classes' as Href);
              }
            }}
          />
          <RecentActivities
            activities={activities}
            title="Recent Activity"
            onViewAllPress={() => router.push('/activity' as Href)}
            onItemPress={(item) => {
              if (item.href) router.push(item.href as Href);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

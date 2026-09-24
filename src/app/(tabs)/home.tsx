import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountBalanceCarousel } from '@/components/home/account-balance-card';
import { ExploreSection } from '@/components/home/explore-section';
import { HomeHeader } from '@/components/home/home-header';
import { RecentActivities } from '@/components/home/recent-activities';
import { SetupBanner } from '@/components/home/setup-banner';
import { HOME_ACCOUNTS } from '@/constants/home-data';
import type { ActivityItem } from '@/lib/activity';
import { BottomTabInset } from '@/constants/theme';
import { useSession } from '@/hooks/use-session';
import { fetchRecentActivity } from '@/lib/activity';
import { fetchUnreadNotificationCount } from '@/lib/notifications';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useSession();
  const firstName = user?.firstName?.trim() || 'there';
  const initials = user?.initials || 'JM';
  const [unreadCount, setUnreadCount] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      void refreshUser();
      void fetchUnreadNotificationCount()
        .then((result) => setUnreadCount(result.unreadCount))
        .catch(() => undefined);
      void fetchRecentActivity(8)
        .then((result) => setActivities(result.activities))
        .catch(() => setActivities([]));
    }, [refreshUser]),
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
        showsVerticalScrollIndicator={false}>
        <View className="px-5">
          <HomeHeader
            firstName={firstName}
            initials={initials}
            unreadCount={unreadCount}
            onNotificationsPress={() => router.push('/notifications')}
            onProfilePress={() => router.push('/profile' as Href)}
          />
        </View>

        <AccountBalanceCarousel accounts={HOME_ACCOUNTS} />

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

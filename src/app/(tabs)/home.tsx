import { router, type Href } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountBalanceCarousel } from '@/components/home/account-balance-card';
import { ExploreSection } from '@/components/home/explore-section';
import { HomeHeader } from '@/components/home/home-header';
import { RecentActivities } from '@/components/home/recent-activities';
import { SetupBanner } from '@/components/home/setup-banner';
import { HOME_ACCOUNTS, RECENT_ACTIVITIES } from '@/constants/home-data';
import { BottomTabInset } from '@/constants/theme';
import { getSignupFirstName, getSignupInitials } from '@/lib/mock-auth';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const firstName = getSignupFirstName() || 'Ayomide';
  const initials = getSignupInitials();

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
            onNotificationsPress={() => router.push('/notifications')}
            onProfilePress={() => router.push('/profile' as Href)}
          />
        </View>

        <AccountBalanceCarousel accounts={HOME_ACCOUNTS} />

        <View className="gap-5 px-5">
          <SetupBanner
            onActionPress={(slideId) => {
              if (slideId === 'kyc') {
                router.push('/kyc' as Href);
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
          <RecentActivities activities={RECENT_ACTIVITIES} />
        </View>
      </ScrollView>
    </View>
  );
}

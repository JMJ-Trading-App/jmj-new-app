import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MoreHeader } from '@/components/more/more-header';
import { MoreMenuSectionCard } from '@/components/more/more-menu-section';
import { UpgradeBanner } from '@/components/more/upgrade-banner';
import {
  MORE_APP_VERSION,
  moreSectionsWithUser,
  type MoreMenuItem,
} from '@/constants/more-data';
import { BottomTabInset } from '@/constants/theme';
import { REFRESH_CONTROL_PROPS } from '@/constants/refresh';
import { useSession } from '@/hooks/use-session';

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { signOut, user, refreshUser } = useSession();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refreshUser();
    }, [refreshUser]),
  );

  const sections = useMemo(
    () => moreSectionsWithUser(user?.kycStatus),
    [user?.kycStatus],
  );

  function handleItemPress(item: MoreMenuItem) {
    if (item.action === 'whatsapp') {
      void Linking.openURL('https://wa.me/');
      return;
    }

    if (item.href) {
      router.push(item.href as Href);
    }
  }

  async function handleLogout() {
    await signOut();
    router.replace('/auth/sign-in' as Href);
  }

  return (
    <View className="flex-1 bg-[#FFF8E9]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-5"
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: BottomTabInset + 24,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void refreshUser().finally(() => setRefreshing(false));
            }}
            {...REFRESH_CONTROL_PROPS}
          />
        }>
        <MoreHeader planLabel={user?.planLabel} planTier={user?.planTier} />

        <UpgradeBanner onPress={() => router.push('/subscriptions' as Href)} />

        {sections.map((section) => (
          <MoreMenuSectionCard key={section.id} section={section} onItemPress={handleItemPress} />
        ))}

        <View className="mt-1 gap-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log Out"
            onPress={handleLogout}
            className="items-center justify-center rounded-[14px] border border-[#FECACA] bg-white py-[15px]"
            style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
            <Text className="font-geist-semibold text-[16px] text-error">Log Out</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete Account"
            onPress={() => {}}
            className="items-center py-1"
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
            <Text className="font-geist-medium text-[15px] text-error">Delete Account</Text>
          </Pressable>

          <Text className="text-center font-geist text-[12px] text-muted">{MORE_APP_VERSION}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

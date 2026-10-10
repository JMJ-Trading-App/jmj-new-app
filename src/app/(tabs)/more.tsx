import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
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
import { useSupportSettings } from '@/hooks/use-support-settings';
import { ApiError } from '@/lib/api/client';
import { deleteMyAccount } from '@/lib/auth';

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { signOut, user, refreshUser } = useSession();
  const { settings, reload: reloadSupport } = useSupportSettings();
  const [refreshing, setRefreshing] = useState(false);
  const [closingAccount, setClosingAccount] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refreshUser();
      void reloadSupport(true);
    }, [refreshUser, reloadSupport]),
  );

  const sections = useMemo(
    () => moreSectionsWithUser(user?.kycStatus, user?.biometricsEnabled),
    [user?.biometricsEnabled, user?.kycStatus],
  );

  function handleItemPress(item: MoreMenuItem) {
    if (item.action === 'whatsapp') {
      void Linking.openURL(settings.whatsappUrl);
      return;
    }

    if (item.id === 'terms' && settings.termsUrl) {
      void Linking.openURL(settings.termsUrl);
      return;
    }

    if (item.id === 'privacy' && settings.privacyUrl) {
      void Linking.openURL(settings.privacyUrl);
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

  function handleDeleteAccount() {
    if (closingAccount) return;
    Alert.alert(
      'Delete account',
      'Your sign-in will be closed. Your profile, KYC, and transaction records stay on file.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () => {
            void confirmDeleteAccount();
          },
        },
      ],
    );
  }

  async function confirmDeleteAccount() {
    setClosingAccount(true);
    try {
      await deleteMyAccount();
      await signOut();
      router.replace('/auth/sign-in' as Href);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Could not close this account.';
      Alert.alert('Delete account', message);
    } finally {
      setClosingAccount(false);
    }
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
              void Promise.all([refreshUser(), reloadSupport(true)]).finally(
                () => setRefreshing(false),
              );
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
            onPress={handleDeleteAccount}
            disabled={closingAccount}
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

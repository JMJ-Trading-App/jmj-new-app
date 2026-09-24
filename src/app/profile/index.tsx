import * as Clipboard from 'expo-clipboard';
import { useFocusEffect } from 'expo-router';
import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RankBadgeIcon, type RankTier } from '@/components/home/home-icons';
import { CopyIcon } from '@/components/invest/invest-flow-icons';
import { EditProfileIcon } from '@/components/more/more-icons';
import { useSession } from '@/hooks/use-session';
import { formatDisplayDate } from '@/lib/date-of-birth';
import { alertError } from '@/lib/errors';
import { cn } from '@/lib/cn';
import { fetchProfile } from '@/lib/users';

function asRankTier(tier?: string | null): RankTier {
  if (tier === 'pro' || tier === 'vip' || tier === 'basic') return tier;
  return 'basic';
}

function kycBadge(status: string | undefined) {
  switch (status) {
    case 'VERIFIED':
      return { label: 'Verified', tone: 'success' as const, value: 'Verified' };
    case 'SUBMITTED':
      return { label: 'In review', tone: 'pending' as const, value: 'Pending verification' };
    case 'REJECTED':
      return { label: 'Rejected', tone: 'pending' as const, value: 'Rejected — resubmit' };
    default:
      return { label: 'Pending', tone: 'pending' as const, value: 'Pending verification' };
  }
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(!user);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          await fetchProfile();
        } catch (error) {
          if (active) alertError(error, 'Could not load profile');
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const fullName = user?.fullName?.trim() || 'Your profile';
  const initials = user?.initials || 'JM';
  const email = user?.email ?? '—';
  const phone = user?.phone ? `+234 ${user.phone}` : '—';
  const dob = formatDisplayDate(user?.dateOfBirth);
  const country = user?.country ?? '—';
  const accountId = user?.accountId ?? '—';
  const planLabel = user?.planLabel ?? 'Free';
  const planTier = asRankTier(user?.planTier);
  const kyc = kycBadge(user?.kycStatus);

  const personal = [
    { label: 'Full Name', value: fullName },
    { label: 'Email Address', value: email },
    { label: 'Phone Number', value: phone },
    { label: 'Date of Birth', value: dob },
    { label: 'Country', value: country },
  ];

  async function handleCopyAccountId() {
    if (!user?.accountId) return;
    await Clipboard.setStringAsync(user.accountId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-2 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>

          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            My Profile
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            onPress={() => router.push('/profile/edit' as Href)}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F5E8B0]">
            <EditProfileIcon size={20} />
          </Pressable>
        </View>
      </View>

      {loading && !user ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#C4A015" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-6 px-5 pb-8"
          showsVerticalScrollIndicator={false}>
          <View className="items-center gap-3 pt-2">
            <View className="relative">
              <View className="h-24 w-24 items-center justify-center rounded-full bg-stone-title">
                <Text className="font-geist-bold text-[28px] text-[#F5E8B0]">{initials}</Text>
              </View>
              <View className="absolute -right-0.5 -top-0.5 h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#E7E5E4]">
                <RankBadgeIcon size={14} tier={planTier} />
              </View>
            </View>

            <View className="items-center gap-1">
              <Text className="font-geist-bold text-[24px] text-stone-title">{fullName}</Text>
              <Text className="font-geist text-[14px] text-muted">{email}</Text>
            </View>

            <View className="rounded-full bg-[#F5E8B0] px-3 py-1.5">
              <Text className="font-geist-semibold text-[12px] text-[#8A6D10]">{planLabel}</Text>
            </View>
          </View>

          <View className="gap-2">
            <Text className="px-1 font-geist-semibold text-[11px] tracking-[0.08em] text-muted">
              PERSONAL INFORMATION
            </Text>
            <View className="overflow-hidden rounded-[20px] bg-[#FFF8E9]">
              {personal.map((field, index) => {
                const isLast = index === personal.length - 1;

                return (
                  <View
                    key={field.label}
                    className={cn('gap-1 px-4 py-3.5', !isLast && 'border-b border-[#F0E6D0]')}>
                    <Text className="font-geist text-[12px] text-muted">{field.label}</Text>
                    <Text className="font-geist-semibold text-[15px] text-stone-title">
                      {field.value}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View className="gap-2">
            <Text className="px-1 font-geist-semibold text-[11px] tracking-[0.08em] text-muted">
              ACCOUNT
            </Text>
            <View className="overflow-hidden rounded-[20px] bg-[#FFF8E9]">
              <View className="gap-1 border-b border-[#F0E6D0] px-4 py-3.5">
                <Text className="font-geist text-[12px] text-muted">Account ID</Text>
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="min-w-0 flex-1 font-geist-semibold text-[15px] text-stone-title">
                    {accountId}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Copy account ID"
                    hitSlop={8}
                    onPress={handleCopyAccountId}>
                    <CopyIcon color={copied ? '#16A34A' : '#9CA3AF'} />
                  </Pressable>
                </View>
              </View>

              <View className="gap-1 px-4 py-3.5">
                <Text className="font-geist text-[12px] text-muted">KYC Status</Text>
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="min-w-0 flex-1 font-geist-semibold text-[15px] text-stone-title">
                    {kyc.value}
                  </Text>
                  <View
                    className={cn(
                      'rounded-full px-2.5 py-1',
                      kyc.tone === 'success' ? 'bg-success' : 'bg-[#F5E8B0]',
                    )}>
                    <Text
                      className={cn(
                        'font-geist-medium text-[12px]',
                        kyc.tone === 'success' ? 'text-white' : 'text-[#8A6D10]',
                      )}>
                      {kyc.label}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

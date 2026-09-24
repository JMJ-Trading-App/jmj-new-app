import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router, useFocusEffect, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  KycAddressIcon,
  KycCameraIcon,
  KycIdCardIcon,
} from '@/components/kyc/kyc-icons';
import { Button } from '@/components/ui/button';
import { KYC_INTRO, KYC_REQUIREMENTS, type KycRequirement } from '@/constants/kyc-data';
import { useSession } from '@/hooks/use-session';
import { fetchKycStatus } from '@/lib/kyc';
import { resetKycDraft } from '@/lib/kyc-draft';

function RequirementIcon({ icon }: { icon: KycRequirement['icon'] }) {
  switch (icon) {
    case 'id':
      return <KycIdCardIcon />;
    case 'selfie':
      return <KycCameraIcon />;
    case 'address':
      return <KycAddressIcon />;
    default:
      return null;
  }
}

function goBack() {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace('/(tabs)/more' as Href);
}

function StatusScreen({
  title,
  body,
  badge,
  ctaLabel = 'Done',
  onCta,
}: {
  title: string;
  body: string;
  badge: string;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={goBack}
          className="h-11 w-11 items-center justify-center">
          <SymbolView name="chevron.left" size={22} tintColor="#1C1917" weight="medium" />
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center gap-5 px-6 pb-8">
        <Image
          source={require('@/assets/images/onboarding/shield.png')}
          style={{ width: 120, height: 120 }}
          contentFit="contain"
        />
        <View className="rounded-full bg-kyc-badge px-4 py-1.5">
          <Text className="font-geist-semibold text-[13px] text-stone-title">{badge}</Text>
        </View>
        <Text className="text-center font-geist-bold text-[24px] leading-[32px] text-stone-title">
          {title}
        </Text>
        <Text className="text-center font-geist text-[15px] leading-[22px] text-stone-body">
          {body}
        </Text>
      </View>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button label={ctaLabel} onPress={onCta ?? goBack} />
      </View>
    </View>
  );
}

export default function KycVerificationScreen() {
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useSession();
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState(
    (user?.kycStatus || 'PENDING').toUpperCase(),
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        try {
          const [me, kyc] = await Promise.all([
            refreshUser(),
            fetchKycStatus().catch(() => null),
          ]);
          if (!active) return;
          const next = (
            kyc?.kycStatus ||
            me?.kycStatus ||
            user?.kycStatus ||
            'PENDING'
          ).toUpperCase();
          setStatus(next);
        } finally {
          if (active) setReady(true);
        }
      })();
      return () => {
        active = false;
      };
    }, [refreshUser, user?.kycStatus]),
  );

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#1C1917" />
      </View>
    );
  }

  if (status === 'VERIFIED') {
    return (
      <StatusScreen
        badge="Verified"
        title="Identity verified"
        body="Your KYC is complete. You can invest, join pools, and withdraw without verifying again."
      />
    );
  }

  if (status === 'SUBMITTED') {
    return (
      <StatusScreen
        badge="In review"
        title="Verification in progress"
        body="We've received your documents and are reviewing them. You'll get a notification when it's done — no need to submit again."
        ctaLabel="Back"
      />
    );
  }

  const rejected = status === 'REJECTED';

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <LinearGradient
        colors={['#000000', '#000000', '#1A1A1A', '#FFFFFF']}
        locations={[0, 0.28, 0.48, 0.62]}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />

      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={goBack}
          className="h-11 w-11 items-center justify-center rounded-full bg-white"
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
          <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-6"
        showsVerticalScrollIndicator={false}>
        <View className="items-center gap-5 pt-2">
          <Image
            source={require('@/assets/images/onboarding/shield.png')}
            style={{ width: 140, height: 140 }}
            contentFit="contain"
          />

          <Text className="text-center font-geist-bold text-[28px] leading-[34px] text-white">
            {rejected ? 'Resubmit your identity' : KYC_INTRO.title}
          </Text>

          <View className="w-full rounded-[18px] bg-[#5C4A14] px-4 py-3.5">
            <Text className="text-center font-geist text-[14px] leading-[20px] text-white">
              {rejected
                ? 'Your previous submission was rejected. Update your documents and try again.'
                : KYC_INTRO.notice}
            </Text>
          </View>
        </View>

        <View className="gap-3 pt-2">
          <Text className="px-1 font-geist-semibold text-[11px] tracking-[0.08em] text-[#9CA3AF]">
            {KYC_INTRO.sectionTitle}
          </Text>

          <View className="gap-3">
            {KYC_REQUIREMENTS.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center gap-3.5 rounded-[20px] bg-[#FFF8E9] px-4 py-4">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-[#F5E8B0]">
                  <RequirementIcon icon={item.icon} />
                </View>
                <View className="min-w-0 flex-1 gap-0.5">
                  <Text className="font-geist-bold text-[15px] text-stone-title">{item.title}</Text>
                  <Text className="font-geist text-[13px] leading-[18px] text-muted">
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Button
          label={rejected ? 'Resubmit verification' : KYC_INTRO.cta}
          onPress={() => {
            resetKycDraft();
            router.push('/kyc/identity-document' as Href);
          }}
        />
      </View>
    </View>
  );
}

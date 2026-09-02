import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Fonts, Spacing } from '@/constants/theme';
import { getSignupFirstName } from '@/lib/mock-auth';

export default function OnboardingCompleteScreen() {
  const firstName = getSignupFirstName() || 'there';

  return (
    <Screen
      showBackButton={false}
      footer={
        <View style={styles.footer}>
          <Button label="Continue" onPress={() => router.replace('/(tabs)/home')} />
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              // KYC flow will be connected later.
            }}>
            <ThemedText style={styles.kycLink}>Complete KYC now</ThemedText>
          </Pressable>
        </View>
      }>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/onboarding/success-badge.png')}
          style={styles.badge}
          contentFit="contain"
        />

        <View style={styles.textBlock}>
          <ThemedText type="heading" style={styles.title}>
            You&apos;re all set, {firstName}!
          </ThemedText>

          <ThemedText type="body" themeColor="textMuted" style={styles.description}>
            Your account is ready. Complete KYC anytime to unlock funding, withdrawals and pool
            investing.
          </ThemedText>

          <View style={styles.statusBadge}>
            <ThemedText style={styles.statusText}>KYC pending</ThemedText>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.six,
  },
  badge: {
    width: 120,
    height: 120,
    marginBottom: Spacing.five,
  },
  textBlock: {
    alignItems: 'center',
    gap: Spacing.three,
    maxWidth: 320,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  statusBadge: {
    backgroundColor: '#FFF4C2',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
  statusText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    gap: Spacing.three,
    alignItems: 'center',
  },
  kycLink: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});

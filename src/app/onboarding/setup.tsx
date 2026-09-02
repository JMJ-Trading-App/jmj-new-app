import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';

export default function OnboardingSetupScreen() {
  return (
    <Screen
      onBack={() => router.back()}
      footer={
        <Button label="Get Started" onPress={() => router.push('/auth/sign-up')} />
      }>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/onboarding/shield.png')}
          style={styles.illustration}
          contentFit="contain"
        />

        <View style={styles.textBlock}>
          <ThemedText type="heading" style={styles.title}>
            Let&apos;s Set Up Your Account!
          </ThemedText>
          <ThemedText type="body" themeColor="textMuted" style={styles.subtitle}>
            A few quick details so we can personalize your experience and keep your account secure.
          </ThemedText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.five,
  },
  illustration: {
    width: 280,
    height: 280,
    marginBottom: Spacing.five,
  },
  textBlock: {
    alignItems: 'center',
    gap: Spacing.two,
    maxWidth: 320,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
});

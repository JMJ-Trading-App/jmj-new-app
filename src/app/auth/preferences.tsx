import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Screen } from '@/components/ui/screen';
import { SelectionCard } from '@/components/ui/selection-card';
import { Fonts, Spacing } from '@/constants/theme';
import { submitPreferences } from '@/lib/mock-auth';

const TRADING_EXPERIENCE_OPTIONS = [
  { id: 'new', label: 'New to trading' },
  { id: 'some', label: 'Some experience' },
  { id: 'experienced', label: 'Experienced trader' },
] as const;

const INTEREST_OPTIONS = [
  { id: 'account-management', label: 'Account management' },
  { id: 'signals', label: 'Signals' },
  { id: 'pool-funding', label: 'Pool funding' },
  { id: 'classes', label: 'Classes' },
] as const;

type TradingExperience = (typeof TRADING_EXPERIENCE_OPTIONS)[number]['id'];
type Interest = (typeof INTEREST_OPTIONS)[number]['id'];

export default function PreferencesScreen() {
  const [experience, setExperience] = useState<TradingExperience>('new');
  const [interests, setInterests] = useState<Interest[]>(['account-management']);
  const [loading, setLoading] = useState(false);

  const canContinue = useMemo(() => interests.length > 0, [interests.length]);

  function toggleInterest(interest: Interest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  }

  async function handleContinue() {
    if (!canContinue || loading) {
      return;
    }

    setLoading(true);
    await submitPreferences({ experience, interests });
    setLoading(false);
    router.push('/auth/secure-account');
  }

  return (
    <Screen
      showHelpButton
      onBack={() => router.back()}
      onHelp={() => {
        // Help flow will be connected later.
      }}
      footer={
        <Button
          disabled={!canContinue}
          label="Continue"
          loading={loading}
          onPress={handleContinue}
        />
      }>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Your trading experience</ThemedText>

          <View style={styles.options}>
            {TRADING_EXPERIENCE_OPTIONS.map((option) => (
              <SelectionCard
                key={option.id}
                label={option.label}
                selected={experience === option.id}
                onPress={() => setExperience(option.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>What are you interested in?</ThemedText>

          <View style={styles.chips}>
            {INTEREST_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                selected={interests.includes(option.id)}
                onPress={() => toggleInterest(option.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: Spacing.five,
  },
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    lineHeight: 24,
  },
  options: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});

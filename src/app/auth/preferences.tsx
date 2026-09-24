import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Screen } from '@/components/ui/screen';
import { SelectionCard } from '@/components/ui/selection-card';
import { submitPreferences } from '@/lib/auth';
import { alertError, alertSuccess } from '@/lib/errors';

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
  const [interests, setInterests] = useState<Interest[]>([
    'account-management',
  ]);
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
    try {
      await submitPreferences({ experience, interests });
      alertSuccess('Preferences saved.', 'Saved');
      router.push('/auth/secure-account');
    } catch (error) {
      alertError(error, 'Could not save preferences');
    } finally {
      setLoading(false);
    }
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
        contentContainerClassName="flex-grow gap-8 pt-2 pb-6"
        showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <ThemedText className="mb-[23px] mt-[15px] font-geist-semibold text-2xl">
            Your trading experience
          </ThemedText>

          <View className="gap-2">
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

        <View className="gap-4">
          <ThemedText className="mb-[23px] mt-[15px] font-geist-semibold text-2xl">
            What are you interested in?
          </ThemedText>

          <View className="flex-row flex-wrap gap-2">
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

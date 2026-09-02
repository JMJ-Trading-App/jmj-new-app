import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { NumericKeypad } from '@/components/ui/numeric-keypad';
import { PinInput } from '@/components/ui/pin-input';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { submitSecureAccount } from '@/lib/mock-auth';

const PIN_LENGTH = 4;

export default function SecureAccountScreen() {
  const theme = useTheme();
  const [pin, setPin] = useState('');
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const canContinue = useMemo(() => pin.length === PIN_LENGTH, [pin.length]);

  function handleKeyPress(digit: string) {
    setPin((current) => (current.length < PIN_LENGTH ? `${current}${digit}` : current));
  }

  function handleDelete() {
    setPin((current) => current.slice(0, -1));
  }

  async function handleContinue() {
    if (!canContinue || loading) {
      return;
    }

    setLoading(true);
    await submitSecureAccount({ pin, biometricsEnabled });
    setLoading(false);
    router.push('/onboarding/complete');
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
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="heading" style={styles.title}>
            Secure your account
          </ThemedText>
          <ThemedText type="body" themeColor="textMuted">
            Set a PIN or use biometrics for quick, safe access
          </ThemedText>
        </View>

        <PinInput value={pin} />

        <View style={[styles.biometricRow, { borderColor: theme.border }]}>
          <SymbolView name="touchid" size={22} tintColor={theme.icon} weight="regular" />
          <ThemedText style={styles.biometricLabel}>Enable Face/Touch ID</ThemedText>
          <Switch
            accessibilityLabel="Enable Face or Touch ID"
            value={biometricsEnabled}
            trackColor={{ false: theme.border, true: theme.buttonPrimary }}
            thumbColor={theme.background}
            onValueChange={setBiometricsEnabled}
          />
        </View>

        <View style={styles.keypad}>
          <NumericKeypad
            onDelete={handleDelete}
            onKeyPress={handleKeyPress}
            onBiometricPress={() => setBiometricsEnabled(true)}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: Spacing.two,
    gap: Spacing.five,
  },
  header: {
    gap: Spacing.two,
  },
  title: {
    textAlign: 'left',
  },
  biometricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  biometricLabel: {
    flex: 1,
  },
  keypad: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: Spacing.two,
  },
});

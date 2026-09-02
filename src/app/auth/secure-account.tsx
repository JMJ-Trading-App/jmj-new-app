import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { NumericKeypad } from '@/components/ui/numeric-keypad';
import { PinInput } from '@/components/ui/pin-input';
import { Screen } from '@/components/ui/screen';
import { submitSecureAccount } from '@/lib/mock-auth';

const PIN_LENGTH = 4;

export default function SecureAccountScreen() {
  const [pin, setPin] = useState('');
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const canContinue = useMemo(() => pin.length === PIN_LENGTH, [pin.length]);

  function handleKeyPress(digit: string) {
    setPin((current) =>
      current.length < PIN_LENGTH ? `${current}${digit}` : current,
    );
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
      <View className="flex-1 gap-8 pt-2">
        <View className="gap-2">
          <ThemedText type="heading" className="text-left">
            Secure your account
          </ThemedText>
          <ThemedText type="body" themeColor="textMuted" className="text-sm">
            Set a PIN or use biometrics for quick, safe access
          </ThemedText>
        </View>

        <PinInput value={pin} />

        <View className="flex-row items-center gap-2 rounded-xl border border-border px-4 py-4">
          <SymbolView
            name="touchid"
            size={22}
            tintColor="#000000"
            weight="regular"
          />
          <ThemedText className="flex-1">Enable Face/Touch ID</ThemedText>
          <Switch
            accessibilityLabel="Enable Face or Touch ID"
            value={biometricsEnabled}
            trackColor={{ false: '#E5E7EB', true: '#000000' }}
            thumbColor="#ffffff"
            onValueChange={setBiometricsEnabled}
          />
        </View>

        <View className="flex-1 justify-end pb-2">
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

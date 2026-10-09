import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { NumericKeypad } from '@/components/ui/numeric-keypad';
import { PinInput } from '@/components/ui/pin-input';
import { Screen } from '@/components/ui/screen';
import { submitSecureAccount } from '@/lib/auth';
import { alertError, alertSuccess } from '@/lib/errors';
import {
  authenticateWithBiometrics,
  canUseDeviceBiometrics,
  getBiometricLabel,
} from '@/lib/lock';

const PIN_LENGTH = 4;

export default function SecureAccountScreen() {
  const [pin, setPin] = useState('');
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);

  const canContinue = useMemo(() => pin.length === PIN_LENGTH, [pin.length]);

  function handleKeyPress(digit: string) {
    setPin((current) =>
      current.length < PIN_LENGTH ? `${current}${digit}` : current,
    );
  }

  function handleDelete() {
    setPin((current) => current.slice(0, -1));
  }

  async function confirmBiometrics() {
    if (bioLoading) return false;
    setBioLoading(true);
    try {
      const available = await canUseDeviceBiometrics();
      if (!available) {
        const label = await getBiometricLabel();
        alertError(
          new Error(`Set up ${label} in your device settings, then try again.`),
          'Biometrics unavailable',
        );
        return false;
      }

      const label = await getBiometricLabel();
      const ok = await authenticateWithBiometrics({
        promptMessage: `Enable ${label} for JMJ`,
      });
      if (ok) {
        alertSuccess(`${label} enabled for quick unlock.`, 'Enabled');
      }
      return ok;
    } catch (error) {
      alertError(error, 'Biometrics unavailable');
      return false;
    } finally {
      setBioLoading(false);
    }
  }

  async function handleBiometricPress() {
    const ok = await confirmBiometrics();
    if (ok) setBiometricsEnabled(true);
  }

  async function handleBiometricToggle(next: boolean) {
    if (!next) {
      setBiometricsEnabled(false);
      return;
    }
    setBiometricsEnabled(await confirmBiometrics());
  }

  async function handleContinue() {
    if (!canContinue || loading) {
      return;
    }

    setLoading(true);
    try {
      await submitSecureAccount({ pin, biometricsEnabled });
      alertSuccess('Your account is secured.', 'All set');
      router.push('/onboarding/complete');
    } catch (error) {
      alertError(error, 'Could not secure account');
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
          disabled={!canContinue || bioLoading}
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
            name={{ ios: 'touchid', android: 'fingerprint', web: 'fingerprint' }}
            size={22}
            tintColor="#000000"
            weight="regular"
          />
          <ThemedText className="flex-1">
            {Platform.OS === 'android'
              ? 'Enable fingerprint or face unlock'
              : 'Enable Face/Touch ID'}
          </ThemedText>
          <Switch
            accessibilityLabel="Enable fingerprint or face unlock"
            value={biometricsEnabled}
            trackColor={{ false: '#E5E7EB', true: '#000000' }}
            thumbColor="#ffffff"
            onValueChange={(next) => {
              void handleBiometricToggle(next);
            }}
          />
        </View>

        <View className="flex-1 justify-end pb-2">
          <NumericKeypad
            onDelete={handleDelete}
            onKeyPress={handleKeyPress}
            onBiometricPress={handleBiometricPress}
          />
        </View>
      </View>
    </Screen>
  );
}

import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InteractionManager, Platform, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { NumericKeypad } from '@/components/ui/numeric-keypad';
import { PinInput } from '@/components/ui/pin-input';
import { Screen } from '@/components/ui/screen';
import { useSession } from '@/hooks/use-session';
import { verifyPin } from '@/lib/auth';
import { alertError, alertSuccess } from '@/lib/errors';
import {
  authenticateWithBiometrics,
  canUseDeviceBiometrics,
  getBiometricLabel,
  hasLocalPin,
  isBiometricsEnabledLocally,
  markUnlocked,
  saveLocalUnlockCredentials,
  verifyLocalPin,
} from '@/lib/lock';
import { hasValidSession } from '@/lib/session';

const PIN_LENGTH = 4;

export default function UnlockScreen() {
  const { user } = useSession();
  const [pin, setPin] = useState('');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [useServerPin, setUseServerPin] = useState(false);
  const attemptedBiometrics = useRef(false);
  const tryBiometricsRef = useRef<() => Promise<void>>(async () => {});

  const canContinue = useMemo(() => pin.length === PIN_LENGTH, [pin.length]);

  const finishUnlock = useCallback(async () => {
    markUnlocked();
    alertSuccess('Welcome back.', 'Unlocked');
    router.replace('/(tabs)/home' as Href);
  }, []);

  const tryBiometrics = useCallback(async () => {
    if (bioLoading) return;
    setBioLoading(true);
    try {
      const available = await canUseDeviceBiometrics();
      if (!available) {
        const label = await getBiometricLabel();
        alertError(
          new Error(`Set up ${label} in your device settings, then try again.`),
          'Biometrics unavailable',
        );
        return;
      }

      const label = await getBiometricLabel();
      const ok = await authenticateWithBiometrics({
        promptMessage: `Unlock JMJ with ${label}`,
      });
      if (ok) {
        await finishUnlock();
      }
    } catch (error) {
      alertError(error, 'Biometrics unavailable');
    } finally {
      setBioLoading(false);
    }
  }, [bioLoading, finishUnlock]);

  tryBiometricsRef.current = tryBiometrics;

  useEffect(() => {
    if (!hasValidSession()) {
      router.replace('/auth/sign-in' as Href);
      return;
    }

    let cancelled = false;

    void (async () => {
      const pinReady = await hasLocalPin();
      if (cancelled) return;

      if (!pinReady && !user?.pinSet) {
        markUnlocked();
        router.replace('/(tabs)/home' as Href);
        return;
      }

      setUseServerPin(!pinReady && Boolean(user?.pinSet));
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.pinSet]);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const interaction = InteractionManager.runAfterInteractions(() => {
      // Android drops BiometricPrompt when it starts before the activity is resumed.
      timer = setTimeout(() => {
        if (cancelled || attemptedBiometrics.current) return;
        void (async () => {
          const pinReady = await hasLocalPin();
          const biometricsOn =
            (await isBiometricsEnabledLocally()) || Boolean(user?.biometricsEnabled);
          const canBio =
            biometricsOn && pinReady && (await canUseDeviceBiometrics());
          if (cancelled || !canBio || attemptedBiometrics.current) return;
          attemptedBiometrics.current = true;
          await tryBiometricsRef.current();
        })();
      }, Platform.OS === 'android' ? 400 : 0);
    });

    return () => {
      cancelled = true;
      interaction.cancel();
      if (timer) clearTimeout(timer);
    };
  }, [ready, user?.biometricsEnabled]);

  function handleKeyPress(digit: string) {
    setPin((current) =>
      current.length < PIN_LENGTH ? `${current}${digit}` : current,
    );
  }

  function handleDelete() {
    setPin((current) => current.slice(0, -1));
  }

  async function handleContinue() {
    if (!canContinue || loading || bioLoading) {
      return;
    }

    setLoading(true);
    try {
      if (useServerPin) {
        await verifyPin(pin);
        await saveLocalUnlockCredentials({
          pin,
          biometricsEnabled: Boolean(user?.biometricsEnabled),
        });
        setUseServerPin(false);
      } else {
        const ok = await verifyLocalPin(pin);
        if (!ok) {
          alertError(new Error('Incorrect PIN. Try again.'), 'Unlock failed');
          setPin('');
          return;
        }
      }
      await finishUnlock();
    } catch {
      alertError(new Error('Incorrect PIN. Try again.'), 'Unlock failed');
      setPin('');
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <Screen showBackButton={false} hideHeader>
        <View className="flex-1 items-center justify-center">
          <ThemedText themeColor="textMuted">Checking secure access…</ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      showHelpButton
      showBackButton={false}
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
            Welcome back
          </ThemedText>
          <ThemedText type="body" themeColor="textMuted" className="text-sm">
            Enter your PIN for quick, safe access
          </ThemedText>
        </View>

        <PinInput value={pin} />

        <View className="flex-1 justify-end pb-2">
          <NumericKeypad
            onDelete={handleDelete}
            onKeyPress={handleKeyPress}
            onBiometricPress={tryBiometrics}
          />
        </View>
      </View>
    </Screen>
  );
}

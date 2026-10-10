import { router, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '@/hooks/use-session';
import { updateBiometricsEnabled } from '@/lib/auth';
import { alertError, alertSuccess } from '@/lib/errors';
import {
  authenticateWithBiometrics,
  canUseDeviceBiometrics,
  getBiometricLabel,
  hasLocalPin,
  isBiometricsEnabledLocally,
} from '@/lib/lock';

export default function BiometricsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const [enabled, setEnabled] = useState(Boolean(user?.biometricsEnabled));
  const [available, setAvailable] = useState(true);
  const [hasPin, setHasPin] = useState(true);
  const [label, setLabel] = useState('biometrics');
  const [busy, setBusy] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        const [localOn, deviceReady, pinReady, biometricLabel] = await Promise.all([
          isBiometricsEnabledLocally(),
          canUseDeviceBiometrics(),
          hasLocalPin(),
          getBiometricLabel(),
        ]);
        if (!active) return;
        setEnabled(localOn || Boolean(user?.biometricsEnabled));
        setAvailable(deviceReady);
        setHasPin(pinReady || Boolean(user?.pinSet));
        setLabel(biometricLabel);
      })();
      return () => {
        active = false;
      };
    }, [user?.biometricsEnabled, user?.pinSet]),
  );

  async function handleToggle(next: boolean) {
    if (busy) return;
    setBusy(true);
    try {
      if (!next) {
        await updateBiometricsEnabled(false);
        setEnabled(false);
        alertSuccess('PIN unlock stays on.', 'Biometrics off');
        return;
      }

      if (!hasPin) {
        alertError(
          new Error('Set your app PIN first. Fingerprint unlock uses that PIN as a backup.'),
          'PIN required',
        );
        return;
      }

      const deviceReady = await canUseDeviceBiometrics();
      if (!deviceReady) {
        setAvailable(false);
        alertError(
          new Error(`Set up ${label} in your phone settings, then try again.`),
          'Biometrics unavailable',
        );
        return;
      }

      const ok = await authenticateWithBiometrics({
        promptMessage: `Enable ${label} for JMJ`,
      });
      if (!ok) return;

      await updateBiometricsEnabled(true);
      setEnabled(true);
      alertSuccess(`${label} will unlock JMJ on this phone.`, 'Biometrics on');
    } catch (error) {
      alertError(error, 'Could not update biometrics');
    } finally {
      setBusy(false);
    }
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
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor="#1C1917"
              weight="medium"
            />
          </Pressable>
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            Biometric Unlock
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <View className="flex-1 gap-6 px-5 pt-6">
        <View className="gap-2">
          <Text className="font-geist-bold text-[24px] text-stone-title">
            Use {label} instead of your PIN
          </Text>
          <Text className="font-geist text-[15px] leading-[22px] text-muted">
            Turn this on or off any time. Your PIN still works when {label} is off or unavailable.
          </Text>
        </View>

        <View className="flex-row items-center gap-3 rounded-[20px] border border-[#EFEFEF] bg-[#FFF8E9] px-4 py-4">
          <Text className="min-w-0 flex-1 font-geist-semibold text-[16px] text-stone-title">
            {enabled ? 'On' : 'Off'}
          </Text>
          <Switch
            accessibilityLabel="Turn biometric unlock on or off"
            disabled={busy}
            value={enabled}
            trackColor={{ false: '#E5E7EB', true: '#000000' }}
            thumbColor="#ffffff"
            onValueChange={(next) => {
              void handleToggle(next);
            }}
          />
        </View>

        {!available ? (
          <Text className="font-geist text-[14px] leading-[20px] text-muted">
            This phone has no {label} set up. Add it in your phone settings, then turn this on.
          </Text>
        ) : null}

        {!hasPin ? (
          <Text className="font-geist text-[14px] leading-[20px] text-muted">
            Enter your app PIN once on the unlock screen before turning this on.
          </Text>
        ) : null}
      </View>
    </View>
  );
}

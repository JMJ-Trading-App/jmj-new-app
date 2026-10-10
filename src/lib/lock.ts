import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const PIN_HASH_KEY = 'jmj_pin_hash';
const BIOMETRICS_KEY = 'jmj_biometrics_enabled';

/** In-memory only — resets when the JS runtime restarts. */
let unlockedThisSession = false;

async function storageGet(key: string) {
  if (Platform.OS === 'web') {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

async function storageSet(key: string, value: string) {
  if (Platform.OS === 'web') {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      // ignore
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function storageDelete(key: string) {
  if (Platform.OS === 'web') {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // ignore
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function hashPin(pin: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `jmj-pin-v1:${pin}`,
  );
}

export function isAccessTokenExpired(token: string | null | undefined) {
  if (!token) return true;
  try {
    const segment = token.split('.')[1];
    if (!segment) return true;
    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    );
    const atobFn = globalThis.atob;
    if (typeof atobFn !== 'function') return true;
    const payload = JSON.parse(atobFn(padded)) as { exp?: number };
    if (!payload.exp) return true;
    // 30s clock skew buffer
    return payload.exp * 1000 <= Date.now() + 30_000;
  } catch {
    return true;
  }
}

export function isUnlocked() {
  return unlockedThisSession;
}

export function markUnlocked() {
  unlockedThisSession = true;
}

export function markLocked() {
  unlockedThisSession = false;
}

export async function saveLocalUnlockCredentials(input: {
  pin: string;
  biometricsEnabled: boolean;
}) {
  const pinHash = await hashPin(input.pin);
  await Promise.all([
    storageSet(PIN_HASH_KEY, pinHash),
    storageSet(BIOMETRICS_KEY, input.biometricsEnabled ? '1' : '0'),
  ]);
}

export async function clearLocalUnlockCredentials() {
  await Promise.all([
    storageDelete(PIN_HASH_KEY),
    storageDelete(BIOMETRICS_KEY),
  ]);
}

export async function hasLocalPin() {
  const hash = await storageGet(PIN_HASH_KEY);
  return Boolean(hash);
}

export async function isBiometricsEnabledLocally() {
  const value = await storageGet(BIOMETRICS_KEY);
  return value === '1';
}

export async function setLocalBiometricsEnabled(enabled: boolean) {
  await storageSet(BIOMETRICS_KEY, enabled ? '1' : '0');
}

export async function verifyLocalPin(pin: string) {
  const stored = await storageGet(PIN_HASH_KEY);
  if (!stored) return false;
  const next = await hashPin(pin);
  return stored === next;
}

export async function canUseDeviceBiometrics() {
  if (Platform.OS === 'web') return false;
  try {
    const hardware = await LocalAuthentication.hasHardwareAsync();
    if (!hardware) return false;
    // Android BiometricManager often reports "not enrolled" on phones that
    // already have a fingerprint saved. Hardware is enough to try the prompt.
    if (Platform.OS === 'android') return true;
    return LocalAuthentication.isEnrolledAsync();
  } catch {
    return false;
  }
}

export async function getBiometricLabel() {
  if (Platform.OS === 'web') return 'Biometrics';
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    // AuthenticationType: FINGERPRINT=1, FACIAL_RECOGNITION=2
    const hasFace = types.includes(2);
    const hasFingerprint = types.includes(1);
    if (Platform.OS === 'ios' && hasFace) return 'Face ID';
    if (hasFingerprint) return 'fingerprint';
    if (hasFace) return 'face recognition';
  } catch {
    // fall through
  }
  return 'biometrics';
}

function biometricFailureMessage(error: string, warning?: string) {
  if (error === 'not_enrolled' || error === 'passcode_not_set') {
    return 'Android could not open the fingerprint prompt. In phone settings, turn on a screen lock PIN and save the fingerprint under Security, then try again.';
  }
  if (error === 'not_available') {
    return 'The fingerprint sensor did not respond. Try again, or use your PIN.';
  }
  if (error === 'lockout') {
    return 'Too many attempts. Use your PIN, then try fingerprint again.';
  }
  if (error === 'authentication_failed') {
    return 'Fingerprint was not recognized. Try again or use your PIN.';
  }
  if (warning && !warning.includes('KeyguardManager')) return warning;
  return 'Fingerprint could not be used. Use your PIN.';
}

async function promptForBiometrics(promptMessage: string) {
  if (Platform.OS !== 'android') {
    return LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Use PIN',
      disableDeviceFallback: true,
    });
  }

  let primary: LocalAuthentication.LocalAuthenticationResult;
  try {
    primary = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Use PIN',
      disableDeviceFallback: true,
      requireConfirmation: false,
      biometricsSecurityLevel: 'weak',
    });
  } catch {
    primary = { success: false, error: 'not_available' };
  }

  if (primary.success) return primary;
  if (
    primary.error !== 'not_enrolled' &&
    primary.error !== 'not_available' &&
    primary.error !== 'unknown'
  ) {
    return primary;
  }

  // Some Android phones only offer the saved fingerprint on the system
  // lock screen, not through the biometric-only prompt.
  try {
    await LocalAuthentication.cancelAuthenticate();
  } catch {
    // The native module may already be idle.
  }

  try {
    return await LocalAuthentication.authenticateAsync({
      promptMessage,
      disableDeviceFallback: false,
      requireConfirmation: false,
      biometricsSecurityLevel: 'strong',
    });
  } catch {
    return primary;
  }
}

export async function authenticateWithBiometrics(options?: {
  promptMessage?: string;
}) {
  if (Platform.OS === 'web') {
    throw new Error('Biometrics are not available on web.');
  }

  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    throw new Error('This device does not support Face ID or fingerprint.');
  }

  if (Platform.OS !== 'android') {
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      throw new Error('No Face ID or fingerprint is set up on this device.');
    }
  }

  const label = await getBiometricLabel();
  const promptMessage = options?.promptMessage ?? `Unlock JMJ with ${label}`;
  let result = await promptForBiometrics(promptMessage);

  // A prompt started before the Android activity was ready leaves the
  // module busy. Clear it and try once more.
  if (!result.success && result.error === 'app_cancel') {
    try {
      await LocalAuthentication.cancelAuthenticate();
    } catch {
      // The native module may already be idle.
    }
    result = await promptForBiometrics(promptMessage);
  }

  if (result.success) return true;
  if (
    result.error === 'user_cancel' ||
    result.error === 'system_cancel' ||
    result.error === 'app_cancel' ||
    result.error === 'user_fallback'
  ) {
    return false;
  }

  throw new Error(biometricFailureMessage(result.error, result.warning));
}

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

export async function verifyLocalPin(pin: string) {
  const stored = await storageGet(PIN_HASH_KEY);
  if (!stored) return false;
  const next = await hashPin(pin);
  return stored === next;
}

export async function canUseDeviceBiometrics() {
  if (Platform.OS === 'web') return false;
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
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

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    throw new Error('No Face ID or fingerprint is set up on this device.');
  }

  const label = await getBiometricLabel();
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: options?.promptMessage ?? `Unlock JMJ with ${label}`,
    cancelLabel: 'Use PIN',
    disableDeviceFallback: true,
  });

  return result.success;
}

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { PublicUser } from '@/lib/api/types';
import {
  clearLocalUnlockCredentials,
  isAccessTokenExpired,
  markLocked,
} from '@/lib/lock';

const TOKEN_KEY = 'jmj_access_token';
const USER_KEY = 'jmj_user';

type SessionState = {
  token: string | null;
  user: PublicUser | null;
  hydrated: boolean;
};

let state: SessionState = {
  token: null,
  user: null,
  hydrated: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(next: Partial<SessionState>) {
  state = { ...state, ...next };
  emit();
}

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

export function getSessionSnapshot() {
  return state;
}

export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function hydrateSession() {
  if (state.hydrated) return state;

  const [token, userRaw] = await Promise.all([
    storageGet(TOKEN_KEY),
    storageGet(USER_KEY),
  ]);

  let user: PublicUser | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as PublicUser;
    } catch {
      user = null;
    }
  }

  if (token && isAccessTokenExpired(token)) {
    await Promise.all([storageDelete(TOKEN_KEY), storageDelete(USER_KEY)]);
    markLocked();
    setState({ token: null, user: null, hydrated: true });
    return state;
  }

  setState({ token, user, hydrated: true });
  return state;
}

export async function getAccessToken() {
  if (!state.hydrated) {
    await hydrateSession();
  }
  if (state.token && isAccessTokenExpired(state.token)) {
    await clearSession();
    return null;
  }
  return state.token;
}

export async function setSession(token: string, user: PublicUser) {
  await Promise.all([
    storageSet(TOKEN_KEY, token),
    storageSet(USER_KEY, JSON.stringify(user)),
  ]);
  setState({ token, user, hydrated: true });
}

export async function updateSessionUser(user: PublicUser) {
  await storageSet(USER_KEY, JSON.stringify(user));
  setState({ user, hydrated: true });
}

export async function clearSession() {
  markLocked();
  await Promise.all([
    storageDelete(TOKEN_KEY),
    storageDelete(USER_KEY),
    clearLocalUnlockCredentials(),
  ]);
  setState({ token: null, user: null, hydrated: true });
}

export function getCachedUser() {
  return state.user;
}

/** Valid persisted session (token present and not expired). */
export function hasValidSession() {
  return Boolean(state.token) && !isAccessTokenExpired(state.token);
}

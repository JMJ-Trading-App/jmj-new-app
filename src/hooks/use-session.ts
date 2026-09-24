import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';

import type { PublicUser } from '@/lib/api/types';
import { fetchMe } from '@/lib/auth';
import {
  clearSession,
  getSessionSnapshot,
  hydrateSession,
  subscribeSession,
  updateSessionUser,
} from '@/lib/session';

let refreshing = false;

/** Pull latest user from API into session (deduped). */
export async function refreshSessionUser() {
  if (!getSessionSnapshot().token || refreshing) return null;
  refreshing = true;
  try {
    return await fetchMe();
  } catch {
    return null;
  } finally {
    refreshing = false;
  }
}

export function useSession() {
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getSessionSnapshot,
  );

  useEffect(() => {
    void hydrateSession();
  }, []);

  const setUser = useCallback(async (user: PublicUser) => {
    await updateSessionUser(user);
  }, []);

  const signOut = useCallback(async () => {
    const { clearPushRegistration } = await import('@/lib/push-register');
    await clearPushRegistration().catch(() => undefined);
    await clearSession();
  }, []);

  return {
    ...session,
    isAuthenticated: Boolean(session.token),
    setUser,
    refreshUser: refreshSessionUser,
    signOut,
  };
}

/** Mount once in root layout — refreshes user on launch and when app returns to foreground. */
export function SessionUserRefresh() {
  const { hydrated, token } = useSession();
  const booted = useRef(false);

  useEffect(() => {
    if (!hydrated || !token) {
      booted.current = false;
      return;
    }

    if (!booted.current) {
      booted.current = true;
      void refreshSessionUser();
    }

    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        void refreshSessionUser();
      }
    });
    return () => sub.remove();
  }, [hydrated, token]);

  return null;
}

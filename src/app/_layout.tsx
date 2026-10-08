import { Stack, router, type Href } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SplashOverlay } from '@/components/splash-overlay';
import { ToastHost } from '@/components/ui/toast-host';
import { useAppFonts } from '@/hooks/use-app-fonts';
import { SessionUserRefresh, useSession } from '@/hooks/use-session';
import {
  clearPushRegistration,
  syncPushRegistration,
  watchPushRegistration,
} from '@/lib/push-register';
import { hydrateSession } from '@/lib/session';

import '@/global.css';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

try {
  SplashScreen.setOptions({
    duration: 400,
    fade: true,
  });
} catch {
  // Some Android release builds reject setOptions during early init.
}

function PushRegistration() {
  const { isAuthenticated, hydrated } = useSession();
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (!hydrated) return;

    if (isAuthenticated) {
      void syncPushRegistration().catch(() => undefined);
      return watchPushRegistration(true);
    }
    void clearPushRegistration().catch(() => undefined);
    return undefined;
  }, [hydrated, isAuthenticated]);

  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const href = response.notification.request.content.data?.href;
        if (typeof href === 'string' && href.length > 0) {
          router.push(href as Href);
          return;
        }
        router.push('/notifications' as Href);
      });

    return () => {
      responseListener.current?.remove();
    };
  }, []);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();
  const appReady = fontsLoaded || !!fontError;

  useEffect(() => {
    void hydrateSession();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!appReady ? null : (
        <>
          <PushRegistration />
          <SessionUserRefresh />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="activity" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="kyc" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="change-password" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="two-factor" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="help-center" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="payout-account" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="signals" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="subscriptions" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="trading-classes" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="occupation" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="invest" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="pool/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="pool/join/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="pool/payout/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="pool/payment/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="pool/status/[id]" options={{ animation: 'slide_from_right' }} />
          </Stack>
        </>
      )}
      <SplashOverlay ready={appReady} />
      {appReady ? <ToastHost /> : null}
    </GestureHandlerRootView>
  );
}

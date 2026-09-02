import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SplashOverlay } from '@/components/splash-overlay';
import { useAppFonts } from '@/hooks/use-app-fonts';

import '@/global.css';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();
  const appReady = fontsLoaded || !!fontError;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!appReady ? null : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
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
      )}
      <SplashOverlay ready={appReady} />
    </GestureHandlerRootView>
  );
}

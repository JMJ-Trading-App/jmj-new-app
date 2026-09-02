import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { SplashOverlay } from '@/components/splash-overlay';
import { useAppFonts } from '@/hooks/use-app-fonts';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();
  const appReady = fontsLoaded || !!fontError;

  return (
    <>
      <StatusBar style="dark" />
      {!appReady ? null : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      )}
      <SplashOverlay ready={appReady} />
    </>
  );
}

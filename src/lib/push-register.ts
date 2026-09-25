import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { registerPushToken, unregisterPushToken } from '@/lib/push';

let handlerConfigured = false;
let currentToken: string | null = null;

function ensureNotificationHandler() {
  if (handlerConfigured) return;
  handlerConfigured = true;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  } catch {
    // Ignore — handler is optional for cold start stability.
  }
}

function resolveProjectId() {
  return (
    process.env.EXPO_PUBLIC_PROJECT_ID ||
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId ||
    undefined
  );
}

export async function syncPushRegistration() {
  if (Platform.OS === 'web') return null;
  if (!Device.isDevice) return null;

  ensureNotificationHandler();

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#F5C518',
      });
    }

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
    if (status !== 'granted') return null;

    const projectId = resolveProjectId();
    if (!projectId) {
      return null;
    }

    const tokenResult = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenResult.data;
    currentToken = token;

    await registerPushToken(token, Platform.OS);
    return token;
  } catch {
    return null;
  }
}

export async function clearPushRegistration() {
  if (!currentToken) return;
  try {
    await unregisterPushToken(currentToken);
  } catch {
    // ignore logout failures
  } finally {
    currentToken = null;
  }
}

export function getCurrentPushToken() {
  return currentToken;
}

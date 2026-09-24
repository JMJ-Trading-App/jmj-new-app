import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * API base URL (include /v1).
 *
 * Priority:
 * 1. EXPO_PUBLIC_API_URL (Metro / EAS env)
 * 2. app.config.js → extra.apiUrl (baked into the binary)
 * 3. Production default
 *
 * Local Nest override in `.env`:
 *   EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/v1
 */
const PRODUCTION_API_URL = 'https://api.jmj.finance/v1';

const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
const fromExtra = (
  Constants.expoConfig?.extra as { apiUrl?: string } | undefined
)?.apiUrl?.trim();

const resolved = fromEnv || fromExtra || PRODUCTION_API_URL;

export const API_BASE_URL = resolved.replace(/\/$/, '');

if (__DEV__) {
  // Helps confirm which host a development build is talking to.
  // eslint-disable-next-line no-console
  console.log(
    `[api] ${Platform.OS} → ${API_BASE_URL}` +
      (fromEnv ? ' (EXPO_PUBLIC_API_URL)' : fromExtra ? ' (app.config extra)' : ' (default)'),
  );
}

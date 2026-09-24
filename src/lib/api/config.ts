import { Platform } from 'react-native';

/**
 * Override with EXPO_PUBLIC_API_URL in `.env`.
 * Android emulator → host machine: http://10.0.2.2:3000/v1
 * Physical device → your LAN IP, e.g. http://192.168.x.x:3000/v1
 * Production → https://api.jmj.finance/v1
 */
const DEFAULT_API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/v1'
    : 'http://localhost:3000/v1';

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_API_URL
).replace(/\/$/, '');

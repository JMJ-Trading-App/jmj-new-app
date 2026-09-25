import { Platform } from 'react-native';

/** Shared RefreshControl styling for JMJ screens. */
export const REFRESH_CONTROL_PROPS = {
  tintColor: '#C4A015',
  colors: ['#C4A015'],
  progressBackgroundColor: Platform.OS === 'android' ? '#FFFFFF' : undefined,
} as const;

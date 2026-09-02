/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    borderFocused: '#000000',
    borderSuccess: '#16A34A',
    borderError: '#991B1B',
    inputBackground: '#ffffff',
    buttonPrimary: '#000000',
    buttonPrimaryDisabled: '#333333',
    buttonSecondary: '#F3F4F6',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondaryText: '#000000',
    icon: '#000000',
    iconMuted: '#6B7280',
    success: '#16A34A',
    error: '#991B1B',
    linkPrimary: '#3c87f7',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    textMuted: '#9CA3AF',
    border: '#3F3F46',
    borderFocused: '#FFFFFF',
    borderSuccess: '#22C55E',
    borderError: '#F87171',
    inputBackground: '#18181B',
    buttonPrimary: '#FFFFFF',
    buttonPrimaryDisabled: '#52525B',
    buttonSecondary: '#27272A',
    buttonPrimaryText: '#000000',
    buttonSecondaryText: '#FFFFFF',
    icon: '#FFFFFF',
    iconMuted: '#9CA3AF',
    success: '#22C55E',
    error: '#F87171',
    linkPrimary: '#60A5FA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type Theme = (typeof Colors)[keyof typeof Colors];

export const Fonts = {
  sans: 'Geist_400Regular',
  serif: 'Geist_400Regular',
  rounded: 'Geist_400Regular',
  mono: 'GeistMono_500Medium',
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semiBold: 'Geist_600SemiBold',
  bold: 'Geist_700Bold',
  monoMedium: 'GeistMono_500Medium',
  monoBold: 'GeistMono_700Bold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

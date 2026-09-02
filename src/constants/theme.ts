/**
 * Design tokens and shared types. Prefer Tailwind classes for styling.
 */

export type FieldBorderState = 'default' | 'focused' | 'success' | 'filled' | 'error';

export type ThemeColor =
  | 'text'
  | 'textSecondary'
  | 'textMuted'
  | 'background'
  | 'border'
  | 'borderFocused'
  | 'borderSuccess'
  | 'borderError'
  | 'inputBackground'
  | 'buttonPrimary'
  | 'buttonPrimaryDisabled'
  | 'buttonSecondary'
  | 'buttonPrimaryText'
  | 'buttonSecondaryText'
  | 'icon'
  | 'iconMuted'
  | 'success'
  | 'error'
  | 'linkPrimary'
  | 'backgroundElement';

export const BottomTabInset = 96;

export const MaxContentWidth = 800;

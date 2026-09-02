import type { Theme } from '@/constants/theme';

export type FieldBorderState = 'default' | 'focused' | 'success' | 'filled' | 'error';

export function getFieldBorderColor(state: FieldBorderState, colors: Theme) {
  switch (state) {
    case 'focused':
    case 'filled':
      return colors.borderFocused;
    case 'success':
      return colors.borderSuccess;
    case 'error':
      return colors.borderError;
    default:
      return colors.border;
  }
}

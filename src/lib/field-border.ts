import type { FieldBorderState } from '@/constants/theme';

export function getFieldBorderClass(state: FieldBorderState) {
  switch (state) {
    case 'focused':
    case 'filled':
      return 'border-border-focused';
    case 'success':
      return 'border-border-success';
    case 'error':
      return 'border-border-error';
    default:
      return 'border-border';
  }
}

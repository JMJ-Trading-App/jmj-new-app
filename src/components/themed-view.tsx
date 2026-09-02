import { View, type ViewProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { cn } from '@/lib/cn';

export type ThemedViewProps = ViewProps & {
  className?: string;
  type?: ThemeColor;
};

const backgroundClasses: Partial<Record<ThemeColor, string>> = {
  background: 'bg-background',
  inputBackground: 'bg-input',
  buttonPrimary: 'bg-foreground',
  buttonSecondary: 'bg-btn-secondary',
  backgroundElement: 'bg-background-element',
};

export function ThemedView({ className, type = 'background', style, ...otherProps }: ThemedViewProps) {
  return (
    <View className={cn(backgroundClasses[type] ?? 'bg-background', className)} style={style} {...otherProps} />
  );
}

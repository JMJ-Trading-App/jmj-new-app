import {
  ActivityIndicator,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/cn';

type ButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'inverse';
};

export function Button({
  label,
  loading = false,
  variant = 'primary',
  style,
  disabled,
  className,
  ...rest
}: ButtonProps & { className?: string }) {
  const isDisabled = disabled || loading;

  const backgroundClass =
    variant === 'inverse'
      ? 'bg-background'
      : variant === 'primary'
        ? disabled && !loading
          ? 'bg-btn-disabled'
          : 'bg-foreground'
        : 'bg-btn-secondary';

  const labelClass =
    variant === 'inverse' || variant === 'secondary'
      ? 'text-foreground'
      : 'text-btn-primary-text';

  const spinnerColor = variant === 'primary' && !(disabled && !loading) ? '#FFFFFF' : '#000000';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={isDisabled}
      className={cn(
        'items-center justify-center rounded-[14px] py-[18px] px-6',
        backgroundClass,
        className,
      )}
      style={({ pressed }) => [pressed && !isDisabled && { opacity: 0.85 }, style]}
      {...rest}>
      <View className="flex-row items-center justify-center">
        <ThemedText type="button" className={cn('text-center', labelClass)}>
          {label}
        </ThemedText>
        {loading ? (
          <ActivityIndicator color={spinnerColor} size="small" style={{ marginLeft: 8 }} />
        ) : null}
      </View>
    </Pressable>
  );
}

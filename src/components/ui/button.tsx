import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === 'inverse'
      ? '#FFFFFF'
      : variant === 'primary'
        ? disabled && !loading
          ? theme.buttonPrimaryDisabled
          : theme.buttonPrimary
        : theme.buttonSecondary;

  const labelColor =
    variant === 'inverse'
      ? '#000000'
      : variant === 'primary'
        ? theme.buttonPrimaryText
        : theme.buttonSecondaryText;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor },
        pressed && !isDisabled && styles.pressed,
        disabled && !loading && styles.disabled,
        style,
      ]}
      {...rest}>
      <View style={styles.content}>
        <ThemedText type="button" style={[styles.label, { color: labelColor }]}>
          {label}
        </ThemedText>
        {loading ? (
          <ActivityIndicator color={labelColor} size="small" style={styles.spinner} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: Spacing.three + 2,
    paddingHorizontal: Spacing.four,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    textAlign: 'center',
  },
  spinner: {
    marginLeft: Spacing.two,
  },
});

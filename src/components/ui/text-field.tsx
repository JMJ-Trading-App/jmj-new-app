import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { getFieldBorderColor, type FieldBorderState } from '@/components/ui/field-border';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextFieldProps = TextInputProps & {
  borderState?: FieldBorderState;
  clearable?: boolean;
  errorMessage?: string;
  label: string;
  onClear?: () => void;
  secureToggle?: boolean;
};

function resolveBorderState(
  focused: boolean,
  borderState: FieldBorderState | undefined,
  hasError: boolean,
) {
  if (hasError) {
    return 'error';
  }

  if (focused) {
    return 'focused';
  }

  return borderState ?? 'default';
}

export function TextField({
  borderState,
  clearable,
  errorMessage,
  label,
  onClear,
  secureToggle,
  secureTextEntry,
  value,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry ?? false);
  const hasError = !!errorMessage;
  const resolvedBorderState = resolveBorderState(focused, borderState, hasError);
  const showClear = clearable && !!value && (focused || hasError);
  const showSecureToggle = secureToggle && !!value;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.inputBackground,
            borderColor: getFieldBorderColor(resolvedBorderState, theme),
          },
        ]}>
        <ThemedText type="fieldLabel" themeColor="textMuted">
          {label}
        </ThemedText>

        <View style={styles.inputRow}>
          <TextInput
            {...rest}
            secureTextEntry={hidden}
            value={value}
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.text }, style]}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
          />

          {showClear ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Clear ${label}`}
              hitSlop={8}
              onPress={onClear}
              style={styles.iconButton}>
              <ThemedText type="fieldLabel" themeColor="iconMuted" style={styles.clearIcon}>
                ×
              </ThemedText>
            </Pressable>
          ) : null}

          {showSecureToggle ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
              hitSlop={8}
              onPress={() => setHidden((current) => !current)}
              style={styles.iconButton}>
              <SymbolView
                name={hidden ? 'eye' : 'eye.slash'}
                size={20}
                tintColor={theme.iconMuted}
                weight="regular"
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      {errorMessage ? (
        <ThemedText type="fieldError" themeColor="error">
          {errorMessage}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.one + 2,
  },
  container: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two + 2,
    gap: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 22,
    padding: 0,
  },
  iconButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.one,
  },
  clearIcon: {
    fontSize: 18,
    lineHeight: 20,
  },
});

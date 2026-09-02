import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import type { FieldBorderState } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { getFieldBorderClass } from '@/lib/field-border';

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
  className,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps & { className?: string }) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry ?? false);
  const hasError = !!errorMessage;
  const resolvedBorderState = resolveBorderState(focused, borderState, hasError);
  const showClear = clearable && !!value && (focused || hasError);
  const showSecureToggle = secureToggle && !!value;

  return (
    <View className={cn('gap-1.5', className)}>
      <View
        className={cn(
          'border bg-input rounded-field px-4 pt-2 pb-2.5 gap-0.5',
          getFieldBorderClass(resolvedBorderState),
        )}>
        <ThemedText type="fieldLabel" themeColor="textMuted">
          {label}
        </ThemedText>

        <View className="flex-row items-center min-h-[24px]">
          <TextInput
            {...rest}
            secureTextEntry={hidden}
            value={value}
            placeholderTextColor="#6B7280"
            className="flex-1 p-0 text-foreground font-geist text-base"
            style={[{ fontSize: 16, lineHeight: undefined, paddingVertical: 0 }, style]}
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
              className="w-7 h-7 items-center justify-center ml-1">
              <ThemedText
                type="fieldLabel"
                themeColor="iconMuted"
                className="text-lg leading-5">
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
              className="w-7 h-7 items-center justify-center ml-1">
              <SymbolView
                name={hidden ? 'eye' : 'eye.slash'}
                size={20}
                tintColor="#6B7280"
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

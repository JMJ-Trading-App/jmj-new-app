import { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const OTP_LENGTH = 6;

type OtpInputProps = {
  length?: number;
  onChange: (value: string) => void;
  value: string;
};

export function OtpInput({ length = OTP_LENGTH, onChange, value }: OtpInputProps) {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const activeIndex = value.length === 0 ? 0 : value.length - 1;

  useEffect(() => {
    if (value.length === length) {
      inputRef.current?.blur();
      Keyboard.dismiss();
    }
  }, [length, value]);

  function handleChange(text: string) {
    const sanitized = text.replace(/\D/g, '').slice(0, length);
    onChange(sanitized);
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Enter verification code"
      onPress={() => inputRef.current?.focus()}
      style={styles.container}>
      <TextInput
        ref={inputRef}
        autoComplete="one-time-code"
        keyboardType="number-pad"
        maxLength={length}
        textContentType="oneTimeCode"
        value={value}
        caretHidden
        importantForAutofill="yes"
        style={styles.hiddenInput}
        onBlur={() => setFocused(false)}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
      />

      <View style={styles.boxes}>
        {Array.from({ length }).map((_, index) => {
          const digit = value[index] ?? '';
          const isActive = focused && index === activeIndex;

          return (
            <View
              key={index}
              style={[
                styles.box,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: isActive ? theme.borderFocused : theme.border,
                  borderWidth: isActive ? 2 : 1,
                },
              ]}>
              <ThemedText type="otpDigit">{digit}</ThemedText>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  boxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

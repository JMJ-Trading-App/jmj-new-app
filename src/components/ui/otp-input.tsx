import { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/cn';

const OTP_LENGTH = 6;

type OtpInputProps = {
  length?: number;
  onChange: (value: string) => void;
  value: string;
  className?: string;
  /** Gold border on filled cells (used in 2FA verify). */
  accentFilled?: boolean;
};

export function OtpInput({
  length = OTP_LENGTH,
  onChange,
  value,
  className,
  accentFilled = false,
}: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const activeIndex = Math.min(value.length, length - 1);

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
      className={cn('self-stretch', className)}>
      <TextInput
        ref={inputRef}
        autoComplete="one-time-code"
        keyboardType="number-pad"
        maxLength={length}
        textContentType="oneTimeCode"
        value={value}
        caretHidden
        importantForAutofill="yes"
        className="absolute opacity-0 w-px h-px"
        onBlur={() => setFocused(false)}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
      />

      <View className="flex-row justify-between gap-2">
        {Array.from({ length }).map((_, index) => {
          const digit = value[index] ?? '';
          const isFilled = digit.length > 0;
          const isActive = focused && index === activeIndex;

          return (
            <View
              key={index}
              className={cn(
                'flex-1 aspect-square max-w-[52px] items-center justify-center rounded-xl bg-input',
                accentFilled && isFilled
                  ? 'border border-[#C4A015]'
                  : isActive
                    ? 'border-2 border-border-focused'
                    : 'border border-border',
              )}>
              <ThemedText type="otpDigit">{digit}</ThemedText>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

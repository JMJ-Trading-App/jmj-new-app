import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CountryFlagIcon, type CountryFlagCode } from '@/components/ui/country-flag-icon';
import type { FieldBorderState } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { getFieldBorderClass } from '@/lib/field-border';
import { formatPhoneNumber } from '@/lib/password-validation';

type PhoneFieldProps = {
  borderState?: FieldBorderState;
  country?: CountryFlagCode;
  countryCode?: string;
  label?: string;
  onChangeText: (value: string) => void;
  onCountryPress?: () => void;
  value: string;
  className?: string;
};

export function PhoneField({
  borderState,
  country = 'ng',
  countryCode = '+234',
  label = 'Mobile Number',
  onChangeText,
  onCountryPress,
  value,
  className,
}: PhoneFieldProps) {
  const [focused, setFocused] = useState(false);
  const resolvedBorderState = borderState ?? (focused ? 'focused' : 'default');
  const borderClass = getFieldBorderClass(focused ? 'focused' : resolvedBorderState);

  return (
    <View
      className={cn(
        'flex-row items-stretch border bg-input rounded-field',
        borderClass,
        className,
      )}>
      <View className="justify-center px-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select country code"
          onPress={onCountryPress}
          className="flex-row items-center gap-1">
          <CountryFlagIcon code={country} size={24} />
          <ThemedText type="fieldLabel" themeColor="textMuted" className="text-xs leading-[14px]">
            ▾
          </ThemedText>
        </Pressable>
      </View>

      <View className="w-px my-2 bg-border" />

      <View className="flex-1 px-4 pt-2 pb-2.5 gap-0.5">
        <ThemedText type="fieldLabel" themeColor="textMuted">
          {label}
        </ThemedText>
        <View className="flex-row items-center gap-1 min-h-[24px]">
          <ThemedText className="font-geist text-base text-foreground">
            {countryCode}
          </ThemedText>
          <TextInput
            keyboardType="phone-pad"
            placeholder=""
            placeholderTextColor="#6B7280"
            className="flex-1 p-0 text-foreground font-geist text-base"
            style={{ fontSize: 16, paddingVertical: 0 }}
            value={value}
            onBlur={() => setFocused(false)}
            onChangeText={(text) => onChangeText(formatPhoneNumber(text))}
            onFocus={() => setFocused(true)}
          />
        </View>
      </View>
    </View>
  );
}

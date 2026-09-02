import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { getFieldBorderColor, type FieldBorderState } from '@/components/ui/field-border';
import { formatPhoneNumber } from '@/lib/password-validation';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PhoneFieldProps = {
  borderState?: FieldBorderState;
  countryCode?: string;
  countryFlag?: string;
  label?: string;
  onChangeText: (value: string) => void;
  onCountryPress?: () => void;
  value: string;
};

export function PhoneField({
  borderState,
  countryCode = '+234',
  countryFlag = '🇳🇬',
  label = 'Mobile Number',
  onChangeText,
  onCountryPress,
  value,
}: PhoneFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const resolvedBorderState = borderState ?? (focused ? 'focused' : 'default');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.inputBackground,
          borderColor: getFieldBorderColor(focused ? 'focused' : resolvedBorderState, theme),
        },
      ]}>
      <View style={styles.countrySection}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select country code"
          onPress={onCountryPress}
          style={styles.countryButton}>
          <ThemedText style={styles.flag}>{countryFlag}</ThemedText>
          <ThemedText type="fieldLabel" themeColor="textMuted" style={styles.chevron}>
            ▾
          </ThemedText>
        </Pressable>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.inputSection}>
        <ThemedText type="fieldLabel" themeColor="textMuted">
          {label}
        </ThemedText>
        <View style={styles.inputRow}>
          <ThemedText style={[styles.prefix, { color: theme.text }]}>{countryCode}</ThemedText>
          <TextInput
            keyboardType="phone-pad"
            placeholder=""
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.text }]}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  countrySection: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  flag: {
    fontSize: 22,
    lineHeight: 26,
  },
  chevron: {
    fontSize: 12,
    lineHeight: 14,
  },
  divider: {
    width: 1,
    marginVertical: Spacing.two,
  },
  inputSection: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two + 2,
    gap: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  prefix: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 22,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 22,
    padding: 0,
  },
});

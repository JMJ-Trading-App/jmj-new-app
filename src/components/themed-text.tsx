import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'heading'
    | 'body'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code'
    | 'button'
    | 'fieldLabel'
    | 'fieldError'
    | 'otpDigit';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'heading' && styles.heading,
        type === 'body' && styles.body,
        type === 'button' && styles.button,
        type === 'fieldLabel' && styles.fieldLabel,
        type === 'fieldError' && styles.fieldError,
        type === 'otpDigit' && styles.otpDigit,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && [styles.linkPrimary, { color: theme.linkPrimary }],
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  smallBold: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    lineHeight: 20,
  },
  default: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 48,
    lineHeight: 52,
  },
  heading: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    lineHeight: 22,
  },
  otpDigit: {
    fontFamily: Fonts.medium,
    fontSize: 24,
    lineHeight: 30,
  },
  fieldLabel: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  fieldError: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 32,
    lineHeight: 44,
  },
  link: {
    fontFamily: Fonts.regular,
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    fontFamily: Fonts.regular,
    lineHeight: 30,
    fontSize: 14,
  },
  code: {
    fontFamily: Platform.select({ android: Fonts.monoBold }) ?? Fonts.monoMedium,
    fontSize: 12,
  },
});

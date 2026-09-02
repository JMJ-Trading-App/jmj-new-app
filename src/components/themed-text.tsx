import { Platform, Text, type TextProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { cn } from '@/lib/cn';

export type ThemedTextProps = TextProps & {
  className?: string;
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

const typeClasses: Record<NonNullable<ThemedTextProps['type']>, string> = {
  small: 'font-geist-medium text-sm leading-5',
  smallBold: 'font-geist-bold text-sm leading-5',
  default: 'font-geist-medium text-base leading-6',
  title: 'font-geist-semibold text-[48px] leading-[52px]',
  heading: 'font-geist-bold text-2xl text-foreground',
  body: 'font-geist text-base leading-6',
  button: 'font-geist-semibold text-base leading-[22px]',
  otpDigit: 'font-geist-medium text-2xl leading-[30px]',
  fieldLabel: 'font-geist text-[13px] leading-[18px]',
  fieldError: 'font-geist text-sm leading-5',
  subtitle: 'font-geist-semibold text-[32px] leading-[44px]',
  link: 'font-geist text-sm leading-[30px]',
  linkPrimary: 'font-geist text-sm leading-[30px] text-link',
  code: Platform.select({
    android: 'font-geist-mono-bold text-xs',
    default: 'font-geist-mono text-xs',
  })!,
};

const colorClasses: Record<ThemeColor, string> = {
  text: 'text-foreground',
  textSecondary: 'text-secondary',
  textMuted: 'text-muted',
  background: 'text-background',
  border: 'text-border',
  borderFocused: 'text-border-focused',
  borderSuccess: 'text-border-success',
  borderError: 'text-border-error',
  inputBackground: 'text-input',
  buttonPrimary: 'text-foreground',
  buttonPrimaryDisabled: 'text-btn-disabled',
  buttonSecondary: 'text-btn-secondary',
  buttonPrimaryText: 'text-btn-primary-text',
  buttonSecondaryText: 'text-foreground',
  icon: 'text-foreground',
  iconMuted: 'text-icon-muted',
  success: 'text-success',
  error: 'text-error',
  linkPrimary: 'text-link',
  backgroundElement: 'text-background-element',
};

export function ThemedText({
  className,
  type = 'default',
  themeColor = 'text',
  style,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      className={cn(typeClasses[type], colorClasses[themeColor], className)}
      style={style}
      {...rest}
    />
  );
}

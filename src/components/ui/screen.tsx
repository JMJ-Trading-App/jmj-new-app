import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  type ViewProps,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/ui/icon-button';
import { ThemedView } from '@/components/themed-view';
import { cn } from '@/lib/cn';

type ScreenProps = ViewProps & {
  children: ReactNode;
  footer?: ReactNode;
  headerRight?: ReactNode;
  keyboardAvoiding?: boolean;
  onBack?: () => void;
  onHelp?: () => void;
  showBackButton?: boolean;
  showHelpButton?: boolean;
  hideHeader?: boolean;
  className?: string;
};

export function Screen({
  children,
  footer,
  headerRight,
  keyboardAvoiding = false,
  onBack,
  onHelp,
  showBackButton = true,
  showHelpButton = false,
  hideHeader = false,
  className,
  style,
  ...rest
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      {hideHeader ? null : (
        <View className="flex-row items-center justify-between px-4 pt-1">
          {showBackButton && onBack ? (
            <IconButton accessibilityLabel="Go back" icon="back" onPress={onBack} />
          ) : (
            <View className="w-10 h-10" />
          )}

          {headerRight ??
            (showHelpButton && onHelp ? (
              <IconButton accessibilityLabel="Help" icon="help" onPress={onHelp} />
            ) : (
              <View className="w-10 h-10" />
            ))}
        </View>
      )}

      <View className={cn('flex-1 px-5', className)} style={style} {...rest}>
        {children}
      </View>

      {footer ? (
        <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );

  return (
    <ThemedView className="flex-1">
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
          className="flex-1">
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </ThemedView>
  );
}

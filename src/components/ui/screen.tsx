import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/ui/icon-button';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type ScreenProps = ViewProps & {
  children: ReactNode;
  footer?: ReactNode;
  headerRight?: ReactNode;
  keyboardAvoiding?: boolean;
  onBack?: () => void;
  onHelp?: () => void;
  showBackButton?: boolean;
  showHelpButton?: boolean;
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
  style,
  ...rest
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        {showBackButton && onBack ? (
          <IconButton accessibilityLabel="Go back" icon="back" onPress={onBack} />
        ) : (
          <View style={styles.headerSide} />
        )}

        {headerRight ??
          (showHelpButton && onHelp ? (
            <IconButton accessibilityLabel="Help" icon="help" onPress={onHelp} />
          ) : (
            <View style={styles.headerSide} />
          ))}
      </View>

      <View style={[styles.content, style]} {...rest}>
        {children}
      </View>

      {footer ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.four) }]}>
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );

  return (
    <ThemedView style={styles.container}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
          style={styles.container}>
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
  },
  headerSide: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  footer: {
    paddingHorizontal: Spacing.four,
  },
});

import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type NumericKeypadProps = {
  onBiometricPress?: () => void;
  onDelete: () => void;
  onKeyPress: (digit: string) => void;
  showBiometric?: boolean;
};

const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
] as const;

export function NumericKeypad({
  onKeyPress,
  onDelete,
  onBiometricPress,
  showBiometric = true,
}: NumericKeypadProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {KEYPAD_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((digit) => (
            <Pressable
              key={digit}
              accessibilityRole="button"
              accessibilityLabel={`Number ${digit}`}
              onPress={() => onKeyPress(digit)}
              style={({ pressed }) => [styles.key, pressed && styles.pressed]}>
              <ThemedText style={styles.keyLabel}>{digit}</ThemedText>
            </Pressable>
          ))}
        </View>
      ))}

      <View style={styles.row}>
        {showBiometric ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Use biometrics"
            onPress={onBiometricPress}
            style={({ pressed }) => [styles.key, pressed && styles.pressed]}>
            <SymbolView name="touchid" size={28} tintColor={theme.icon} weight="regular" />
          </Pressable>
        ) : (
          <View style={styles.key} />
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Number 0"
          onPress={() => onKeyPress('0')}
          style={({ pressed }) => [styles.key, pressed && styles.pressed]}>
          <ThemedText style={styles.keyLabel}>0</ThemedText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete"
          onPress={onDelete}
          style={({ pressed }) => [styles.key, pressed && styles.pressed]}>
          <SymbolView name="delete.left" size={24} tintColor={theme.icon} weight="medium" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  key: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    maxWidth: 120,
  },
  keyLabel: {
    fontFamily: Fonts.regular,
    fontSize: 28,
    lineHeight: 34,
  },
  pressed: {
    opacity: 0.5,
  },
});

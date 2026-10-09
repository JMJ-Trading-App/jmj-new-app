import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/cn';

type NumericKeypadProps = {
  onBiometricPress?: () => void;
  onDelete: () => void;
  onKeyPress: (digit: string) => void;
  showBiometric?: boolean;
  className?: string;
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
  className,
}: NumericKeypadProps) {
  return (
    <View className={cn('gap-2', className)}>
      {KEYPAD_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row justify-between">
          {row.map((digit) => (
            <Pressable
              key={digit}
              accessibilityRole="button"
              accessibilityLabel={`Number ${digit}`}
              onPress={() => onKeyPress(digit)}
              className="flex-1 items-center justify-center min-h-14 max-w-[120px]"
              style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
              <ThemedText className="font-geist text-[28px] leading-[34px]">{digit}</ThemedText>
            </Pressable>
          ))}
        </View>
      ))}

      <View className="flex-row justify-between">
        {showBiometric ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Use biometrics"
            onPress={onBiometricPress}
            className="flex-1 items-center justify-center min-h-14 max-w-[120px]"
            style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
            <SymbolView
              name={{ ios: 'touchid', android: 'fingerprint', web: 'fingerprint' }}
              size={28}
              tintColor="#000000"
              weight="regular"
            />
          </Pressable>
        ) : (
          <View className="flex-1 items-center justify-center min-h-14 max-w-[120px]" />
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Number 0"
          onPress={() => onKeyPress('0')}
          className="flex-1 items-center justify-center min-h-14 max-w-[120px]"
          style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
          <ThemedText className="font-geist text-[28px] leading-[34px]">0</ThemedText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete"
          onPress={onDelete}
          className="flex-1 items-center justify-center min-h-14 max-w-[120px]"
          style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
          <SymbolView
            name={{ ios: 'delete.left', android: 'backspace', web: 'backspace' }}
            size={24}
            tintColor="#000000"
            weight="medium"
          />
        </Pressable>
      </View>
    </View>
  );
}

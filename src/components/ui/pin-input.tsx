import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PIN_LENGTH = 4;

type PinInputProps = {
  length?: number;
  value: string;
};

export function PinInput({ length = PIN_LENGTH, value }: PinInputProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => {
        const filled = index < value.length;

        return (
          <View
            key={index}
            style={[
              styles.box,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
              },
            ]}>
            {filled ? <View style={[styles.dot, { backgroundColor: theme.text }]} /> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  box: {
    width: 72,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

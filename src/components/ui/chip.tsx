import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipProps = {
  label: string;
  onPress: () => void;
  selected: boolean;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.buttonPrimary : theme.background,
          borderColor: selected ? theme.buttonPrimary : theme.text,
        },
        pressed && styles.pressed,
      ]}>
      <ThemedText
        style={[
          styles.label,
          { color: selected ? theme.buttonPrimaryText : theme.text },
        ]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.85,
  },
});

import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SelectionCardProps = {
  label: string;
  onPress: () => void;
  selected: boolean;
  selectedBackground?: string;
};

export function SelectionCard({
  label,
  selected,
  onPress,
  selectedBackground = '#F5C518',
}: SelectionCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: selected ? selectedBackground : theme.background,
          borderColor: selected ? theme.text : theme.border,
        },
        pressed && styles.pressed,
      ]}>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: Spacing.three + 4,
    paddingHorizontal: Spacing.four,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});

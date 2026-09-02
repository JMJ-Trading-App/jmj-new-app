import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type IconButtonProps = {
  onPress: () => void;
  accessibilityLabel: string;
  icon: 'back' | 'help';
};

export function IconButton({ onPress, accessibilityLabel, icon }: IconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={12}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      {icon === 'back' ? (
        <SymbolView name="chevron.left" size={22} tintColor={theme.icon} weight="medium" />
      ) : (
        <SymbolView
          name="questionmark.circle"
          size={24}
          tintColor={theme.icon}
          weight="regular"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});

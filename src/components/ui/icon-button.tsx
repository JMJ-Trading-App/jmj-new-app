import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';

import { cn } from '@/lib/cn';

type IconButtonProps = {
  onPress: () => void;
  accessibilityLabel: string;
  icon: 'back' | 'help';
  className?: string;
};

export function IconButton({ onPress, accessibilityLabel, icon, className }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={12}
      onPress={onPress}
      className={cn('w-10 h-10 items-center justify-center', className)}
      style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
      {icon === 'back' ? (
        <SymbolView name="chevron.left" size={22} tintColor="#000000" weight="medium" />
      ) : (
        <SymbolView
          name="questionmark.circle"
          size={24}
          tintColor="#000000"
          weight="regular"
        />
      )}
    </Pressable>
  );
}

import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/cn';

type ChipProps = {
  label: string;
  onPress: () => void;
  selected: boolean;
  className?: string;
};

export function Chip({ label, selected, onPress, className }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'border rounded-full py-2.5 px-4',
        selected ? 'bg-foreground border-foreground' : 'bg-background border-foreground',
        className,
      )}
      style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
      <ThemedText
        className={cn(
          'font-geist-medium text-[15px] leading-5',
          selected ? 'text-btn-primary-text' : 'text-foreground',
        )}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

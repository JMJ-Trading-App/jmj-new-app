import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/cn';

type SelectionCardProps = {
  label: string;
  onPress: () => void;
  selected: boolean;
  selectedBackground?: string;
  className?: string;
};

export function SelectionCard({
  label,
  selected,
  onPress,
  selectedBackground,
  className,
}: SelectionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        'items-start justify-center border rounded-xl py-5 px-6',
        selected ? 'border-foreground bg-brand' : 'border-border bg-background',
        className,
      )}
      style={({ pressed }) => [
        selected && selectedBackground ? { backgroundColor: selectedBackground } : undefined,
        pressed && { opacity: 0.85 },
      ]}>
      <ThemedText className="font-geist-medium text-base leading-[22px] text-left self-stretch">
        {label}
      </ThemedText>
    </Pressable>
  );
}

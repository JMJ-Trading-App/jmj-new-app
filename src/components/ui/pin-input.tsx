import { View } from 'react-native';

import { cn } from '@/lib/cn';

const PIN_LENGTH = 4;

type PinInputProps = {
  length?: number;
  value: string;
  className?: string;
};

export function PinInput({ length = PIN_LENGTH, value, className }: PinInputProps) {
  return (
    <View className={cn('flex-row justify-center gap-4', className)}>
      {Array.from({ length }).map((_, index) => {
        const filled = index < value.length;

        return (
          <View
            key={index}
            className="w-[60px] h-[60px] rounded-xl border border-border bg-input items-center justify-center">
            {filled ? <View className="w-3 h-3 rounded-full bg-foreground" /> : null}
          </View>
        );
      })}
    </View>
  );
}

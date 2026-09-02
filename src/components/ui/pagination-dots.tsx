import { View } from 'react-native';

import { cn } from '@/lib/cn';

type PaginationDotsProps = {
  activeIndex: number;
  total?: number;
  className?: string;
};

export function PaginationDots({ activeIndex, total = 3, className }: PaginationDotsProps) {
  return (
    <View className={cn('flex-row items-center justify-center gap-2', className)}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={cn(
            'w-2 h-2 rounded-full',
            index === activeIndex ? 'bg-background' : 'bg-[#3F3F46]',
          )}
        />
      ))}
    </View>
  );
}

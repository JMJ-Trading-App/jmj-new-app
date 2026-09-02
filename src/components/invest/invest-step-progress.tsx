import { Text, View } from 'react-native';

import { cn } from '@/lib/cn';

type InvestStepProgressProps = {
  step: number;
  total: number;
};

export function InvestStepProgress({ step, total }: InvestStepProgressProps) {
  const filled = step >= total ? total - 1 : step;

  return (
    <View className="gap-2">
      <View className="flex-row gap-1.5">
        {Array.from({ length: total }, (_, index) => {
          const active = index < filled;
          return (
            <View
              key={index}
              className={cn('h-1 flex-1 rounded-full', active ? 'bg-brand' : 'bg-[#E5E7EB]')}
            />
          );
        })}
      </View>
      <Text className="font-geist text-[12px] text-muted">
        Step {step} of {total}
      </Text>
    </View>
  );
}

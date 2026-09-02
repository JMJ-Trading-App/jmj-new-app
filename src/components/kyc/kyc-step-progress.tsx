import { Text, View } from 'react-native';

import { cn } from '@/lib/cn';

type KycStepProgressProps = {
  step: number;
  total: number;
};

export function KycStepProgress({ step, total }: KycStepProgressProps) {
  return (
    <View className="gap-2">
      <View className="flex-row gap-1.5">
        {Array.from({ length: total }, (_, index) => {
          const active = index < step;
          return (
            <View
              key={index}
              className={cn('h-1 flex-1 rounded-full', active ? 'bg-[#C4A015]' : 'bg-[#E5E7EB]')}
            />
          );
        })}
      </View>
      <Text className="font-geist-medium text-[13px] text-muted">
        Step {step} of {total}
      </Text>
    </View>
  );
}

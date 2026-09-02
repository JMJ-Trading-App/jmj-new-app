import { Text, View } from 'react-native';

import type { SignalProgressStep } from '@/constants/signals-data';
import { cn } from '@/lib/cn';

type SignalProgressTimelineProps = {
  steps: SignalProgressStep[];
};

export function SignalProgressTimeline({ steps }: SignalProgressTimelineProps) {
  return (
    <View className="rounded-[18px] border border-[#EFEFEF] bg-white px-4 py-4">
      <Text className="mb-4 font-geist-semibold text-[11px] tracking-[0.08em] text-muted">
        PROGRESS
      </Text>

      <View>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isPending = step.tone === 'pending';
          const dotClass =
            step.tone === 'done'
              ? 'bg-[#22C55E]'
              : step.tone === 'current'
                ? 'bg-brand'
                : 'bg-[#D1D5DB]';

          return (
            <View key={step.id} className="flex-row gap-3">
              <View className="items-center">
                <View className={cn('mt-1.5 h-2.5 w-2.5 rounded-full', dotClass)} />
                {!isLast ? (
                  <View className="my-1 w-0.5 flex-1 bg-[#E5E7EB]" style={{ minHeight: 30 }} />
                ) : null}
              </View>

              <View className={cn('min-w-0 flex-1', isLast ? 'pb-0' : 'pb-5')}>
                <Text
                  className={cn(
                    'font-geist-bold text-[15px]',
                    isPending ? 'text-muted' : 'text-stone-title',
                  )}>
                  {step.title}
                </Text>
                {step.subtitle ? (
                  <Text className="mt-0.5 font-geist text-[13px] text-muted">{step.subtitle}</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

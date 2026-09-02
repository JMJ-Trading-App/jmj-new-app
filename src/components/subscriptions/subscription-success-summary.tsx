import { Text, View } from 'react-native';

import { cn } from '@/lib/cn';

type DetailRow = {
  label: string;
  value: string;
  emphasize?: boolean;
};

type SubscriptionSuccessSummaryProps = {
  rows: DetailRow[];
};

export function SubscriptionSuccessSummary({ rows }: SubscriptionSuccessSummaryProps) {
  return (
    <View className="w-full overflow-hidden rounded-[20px] border border-[#EFEFEF] bg-white px-4">
      {rows.map((row, index) => {
        const isLast = index === rows.length - 1;

        return (
          <View
            key={row.label}
            className={cn(
              'flex-row items-center justify-between gap-3 py-4',
              !isLast && 'border-b border-[#F3F4F6]',
            )}>
            <Text className="font-geist text-[14px] text-muted">{row.label}</Text>
            <Text
              className={cn(
                'shrink text-right font-geist text-[14px]',
                row.emphasize === false
                  ? 'font-geist-medium text-stone-body'
                  : 'font-geist-bold text-stone-title',
              )}
              numberOfLines={1}>
              {row.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

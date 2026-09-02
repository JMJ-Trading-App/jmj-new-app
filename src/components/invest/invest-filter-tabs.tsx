import { Pressable, Text, View } from 'react-native';

import { INVEST_FILTERS, type InvestFilter } from '@/constants/invest-data';
import { cn } from '@/lib/cn';

type InvestFilterTabsProps = {
  value: InvestFilter;
  onChange: (value: InvestFilter) => void;
};

export function InvestFilterTabs({ value, onChange }: InvestFilterTabsProps) {
  return (
    <View className="flex-row rounded-full bg-[#F3F4F6] p-1">
      {INVEST_FILTERS.map((filter) => {
        const selected = filter.id === value;

        return (
          <Pressable
            key={filter.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(filter.id)}
            className={cn(
              'flex-1 items-center justify-center rounded-full py-2.5',
              selected && 'bg-white',
            )}
            style={
              selected
                ? {
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    elevation: 1,
                  }
                : undefined
            }>
            <Text
              className={cn(
                'font-geist-medium text-[13px]',
                selected ? 'text-stone-title' : 'text-muted',
              )}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

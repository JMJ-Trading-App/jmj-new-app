import { Pressable, Text, View } from 'react-native';

import { SIGNALS_TABS, type SignalsTab } from '@/constants/signals-data';
import { cn } from '@/lib/cn';

type SignalsFilterTabsProps = {
  value: SignalsTab;
  onChange: (value: SignalsTab) => void;
};

export function SignalsFilterTabs({ value, onChange }: SignalsFilterTabsProps) {
  return (
    <View className="flex-row rounded-full bg-[#F3F4F6] p-1">
      {SIGNALS_TABS.map((tab) => {
        const selected = tab.id === value;

        return (
          <Pressable
            key={tab.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.id)}
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
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

import { Pressable, Text, View } from 'react-native';

import { SUBSCRIPTION_TABS, type SubscriptionCategory } from '@/constants/subscriptions-data';
import { cn } from '@/lib/cn';

type SubscriptionTabsProps = {
  value: SubscriptionCategory;
  onChange: (value: SubscriptionCategory) => void;
};

export function SubscriptionTabs({ value, onChange }: SubscriptionTabsProps) {
  return (
    <View className="flex-row rounded-[14px] bg-[#F3F4F6] p-1">
      {SUBSCRIPTION_TABS.map((tab) => {
        const selected = tab.id === value;

        return (
          <Pressable
            key={tab.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.id)}
            className={cn(
              'flex-1 items-center justify-center rounded-[12px] py-3',
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
                'font-geist-semibold text-[14px]',
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

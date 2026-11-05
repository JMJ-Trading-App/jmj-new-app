import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  HomeTabIcon,
  InvestTabIcon,
  MoreTabIcon,
  PoolTabIcon,
} from '@/components/ui/tab-icons';
import { cn } from '@/lib/cn';

const ACTIVE_COLOR = '#1C1917';
const INACTIVE_COLOR = '#7B7B7B';

const TABS = [
  { name: 'home', href: '/(tabs)/home', label: 'Home', Icon: HomeTabIcon },
  { name: 'invest', href: '/(tabs)/invest', label: 'Invest', Icon: InvestTabIcon },
  { name: 'pool', href: '/(tabs)/pool', label: 'Pool', Icon: PoolTabIcon },
  { name: 'more', href: '/(tabs)/more', label: 'More', Icon: MoreTabIcon },
] as const;

export default function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs className="flex-1 bg-[#F7F7F5]">
      <TabSlot />

      <View
        pointerEvents="box-none"
        className="absolute bottom-0 left-0 right-0 items-center px-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
        <View
          className="w-full max-w-[400px] flex-row items-center justify-between rounded-full border border-[#EFEFEF] bg-white px-1.5 py-1.5"
          style={{
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 8,
          }}>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <WebTabButton label={tab.label} Icon={tab.Icon} />
            </TabTrigger>
          ))}
        </View>
      </View>

      <TabList className="hidden">
        {TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href}>
            <Text>{tab.label}</Text>
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

type WebTabButtonProps = TabTriggerSlotProps & {
  Icon: (props: { color: string; size?: number }) => ReactNode;
  label: string;
};

function WebTabButton({ isFocused, Icon, label, ...props }: WebTabButtonProps) {
  const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

  return (
    <Pressable
      {...props}
      className={cn(
        'min-w-0 flex-1 items-center justify-center rounded-full px-1.5 py-2',
        isFocused && 'bg-tab-active',
      )}>
      <Icon color={color} size={22} />
      <Text
        numberOfLines={1}
        className={cn(
          'mt-1 font-geist-medium text-[10px] leading-[13px]',
          isFocused ? 'text-stone-title' : 'text-btn-disabled',
        )}>
        {label}
      </Text>
    </Pressable>
  );
}

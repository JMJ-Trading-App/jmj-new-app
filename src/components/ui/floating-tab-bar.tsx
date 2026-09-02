import type { BottomTabBarProps } from 'expo-router/tabs';
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

const TAB_ICONS = {
  home: HomeTabIcon,
  invest: InvestTabIcon,
  pool: PoolTabIcon,
  more: MoreTabIcon,
} as const;

type TabName = keyof typeof TAB_ICONS;

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-0 left-0 right-0 items-center px-5"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
      <View
        className="w-full max-w-[400px] flex-row items-center justify-between rounded-full border border-[#EFEFEF] bg-white px-2 py-1.5"
        style={{
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 8,
        }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
                ? options.title
                : route.name;
          const isFocused = state.index === index;
          const Icon = TAB_ICONS[route.name as TabName] ?? HomeTabIcon;
          const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

          function onPress() {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              onPress={onPress}
              className={cn(
                'min-w-[72px] flex-1 items-center justify-center rounded-full px-3 py-2',
                isFocused && 'bg-tab-active',
              )}>
              <Icon color={color} size={22} />
              <Text
                className={cn(
                  'mt-1 font-geist-medium text-[11px] leading-[14px]',
                  isFocused ? 'text-stone-title' : 'text-btn-disabled',
                )}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

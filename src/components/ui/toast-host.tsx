import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';
import {
  dismissToast,
  getToasts,
  subscribeToasts,
  type ToastItem,
} from '@/lib/toast';

function toneClasses(tone: ToastItem['tone']) {
  switch (tone) {
    case 'success':
      return {
        container: 'border-[#BBF7D0] bg-[#F0FDF4]',
        title: 'text-[#166534]',
        message: 'text-[#15803D]',
        accent: 'bg-[#16A34A]',
      };
    case 'error':
      return {
        container: 'border-[#FECACA] bg-[#FEF2F2]',
        title: 'text-[#991B1B]',
        message: 'text-[#B91C1C]',
        accent: 'bg-[#DC2626]',
      };
    default:
      return {
        container: 'border-[#F5E8B0] bg-[#FFFBEB]',
        title: 'text-stone-title',
        message: 'text-stone-body',
        accent: 'bg-brand',
      };
  }
}

function ToastCard({ toast }: { toast: ToastItem }) {
  const tones = toneClasses(toast.tone);

  return (
    <Animated.View entering={FadeInUp.duration(220)} exiting={FadeOutUp.duration(180)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss notification"
        onPress={() => dismissToast(toast.id)}
        className={cn(
          'overflow-hidden rounded-[14px] border px-4 py-3 shadow-sm',
          tones.container,
        )}
        style={({ pressed }) => [pressed && { opacity: 0.92 }]}>
        <View className={cn('absolute bottom-0 left-0 top-0 w-1', tones.accent)} />
        {toast.title ? (
          <Text className={cn('mb-0.5 font-geist-semibold text-[14px]', tones.title)}>
            {toast.title}
          </Text>
        ) : null}
        <Text className={cn('font-geist text-[13px] leading-[18px]', tones.message)}>
          {toast.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<ToastItem[]>(getToasts);

  useEffect(() => subscribeToasts(setItems), []);

  if (items.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 z-[100] gap-2 px-4"
      style={{ top: insets.top + 8 }}>
      {items.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </View>
  );
}

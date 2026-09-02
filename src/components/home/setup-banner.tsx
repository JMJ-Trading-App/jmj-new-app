import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { LinkIcon } from '@/components/home/home-icons';
import { cn } from '@/lib/cn';

const SETUP_SLIDES = [
  {
    id: 'kyc',
    title: "You're almost set up",
    description: 'Finish your verification to unlock pool funding and investments.',
    action: 'Complete KYC',
  },
  {
    id: 'funding',
    title: 'Add your first funds',
    description: 'Fund your account to start investing and joining pools.',
    action: 'Add funds',
  },
  {
    id: 'explore',
    title: 'Explore tools',
    description: 'Learn with classes and trade smarter with live signals.',
    action: 'Explore',
  },
] as const;

type SetupBannerProps = {
  onActionPress?: (slideId: string) => void;
};

export function SetupBanner({ onActionPress }: SetupBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = SETUP_SLIDES[activeIndex];

  return (
    <View className="gap-3">
      <Pressable
        accessibilityRole="button"
        onPress={() => setActiveIndex((current) => (current + 1) % SETUP_SLIDES.length)}
        className="overflow-hidden rounded-[20px] bg-[#1A1A1A] px-4 py-4">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#2A2A2A]">
            <LinkIcon />
          </View>

          <View className="min-w-0 flex-1 gap-1">
            <Text className="font-geist-semibold text-[14px] text-white">{slide.title}</Text>
            <Text className="font-geist text-[12px] leading-[16px] text-[#D1D5DB]">
              {slide.description}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => onActionPress?.(slide.id)}
            className="rounded-full bg-[#E8A317] px-3 py-2">
            <Text className="font-geist-semibold text-[12px] text-white">{slide.action}</Text>
          </Pressable>
        </View>
      </Pressable>

      <View className="flex-row items-center justify-center gap-1.5">
        {SETUP_SLIDES.map((item, index) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Go to slide ${index + 1}`}
            onPress={() => setActiveIndex(index)}
            className={cn(
              'h-1.5 rounded-full',
              index === activeIndex ? 'w-4 bg-[#8B6B2E]' : 'w-1.5 bg-[#D1D5DB]',
            )}
          />
        ))}
      </View>
    </View>
  );
}

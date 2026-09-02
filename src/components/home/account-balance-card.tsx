import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { EyeIcon, HandTapIcon, TrendIcon } from '@/components/home/home-icons';
import type { AccountCard } from '@/constants/home-data';
import { cn } from '@/lib/cn';

/** CSS: linear-gradient(140.73deg, #000000 21.6%, #423300 99.37%) */
const CARD_GRADIENT = {
  colors: ['#000000', '#423300'] as const,
  locations: [0.216, 0.9937] as const,
  start: { x: 0.18, y: 0.11 },
  end: { x: 0.82, y: 0.89 },
};

const FLIP_HALF_MS = 220;

type AccountBalanceCarouselProps = {
  accounts: AccountCard[];
};

export function AccountBalanceCarousel({ accounts }: AccountBalanceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const rotateY = useSharedValue(0);

  const account = accounts[displayIndex] ?? accounts[0];

  function finishFlip(nextIndex: number) {
    setActiveIndex(nextIndex);
    setIsFlipping(false);
  }

  function flipToNext() {
    if (isFlipping || accounts.length < 2) return;

    const nextIndex = (activeIndex + 1) % accounts.length;
    setIsFlipping(true);

    rotateY.value = withTiming(90, { duration: FLIP_HALF_MS }, (finished) => {
      if (!finished) return;
      runOnJS(setDisplayIndex)(nextIndex);
      rotateY.value = -90;
      rotateY.value = withTiming(0, { duration: FLIP_HALF_MS }, (done) => {
        if (done) runOnJS(finishFlip)(nextIndex);
      });
    });
  }

  const flipStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${rotateY.value}deg` }],
  }));

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-24, 24])
    .failOffsetY([-12, 12])
    .onEnd((event) => {
      if (Math.abs(event.translationX) < 40) return;
      runOnJS(flipToNext)();
    });

  return (
    <View className="gap-3 px-5">
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={flipStyle}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${account.label}. Tap or swipe to flip accounts`}
            onPress={flipToNext}
            className="overflow-hidden rounded-[24px]">
            <LinearGradient
              colors={[...CARD_GRADIENT.colors]}
              locations={[...CARD_GRADIENT.locations]}
              start={CARD_GRADIENT.start}
              end={CARD_GRADIENT.end}
              style={{ paddingHorizontal: 20, paddingVertical: 20, minHeight: 168 }}>
              <Text className="font-geist text-[13px] text-[#9CA3AF]">{account.label}</Text>

              <View className="mt-3 flex-row items-center gap-3">
                <Text className="font-geist-bold text-[36px] leading-[42px] text-white">
                  {hidden ? '••••••' : account.balance}
                </Text>
                  <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={hidden ? 'Show balance' : 'Hide balance'}
                  hitSlop={8}
                  onPress={() => setHidden((current) => !current)}>
                  <EyeIcon />
                </Pressable>
              </View>

              <View className="mt-4 flex-row items-end justify-between">
                <View
                  className={cn(
                    'flex-row items-center gap-1.5 rounded-full px-2.5 py-1.5',
                    account.monthlyPositive === false ? 'bg-[#FEE2E2]' : 'bg-[#DCFCE7]',
                  )}>
                  <TrendIcon color={account.monthlyPositive === false ? '#991B1B' : '#166534'} />
                  <Text
                    className={cn(
                      'font-geist-medium text-[12px]',
                      account.monthlyPositive === false ? 'text-[#991B1B]' : 'text-[#166534]',
                    )}>
                    {account.monthlyChange}
                  </Text>
                </View>

                {accounts.length > 1 ? (
                  <View className="flex-row items-center gap-1.5">
                    <Text className="font-geist text-[11px] text-[#9CA3AF]">Tap or swipe to flip</Text>
                    <HandTapIcon />
                  </View>
                ) : null}
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </GestureDetector>

      {accounts.length > 1 ? (
        <View className="flex-row items-center justify-center gap-1.5">
          {accounts.map((item, index) => (
            <View
              key={item.id}
              className={cn(
                'h-1.5 rounded-full',
                index === activeIndex ? 'w-4 bg-stone-title' : 'w-1.5 bg-[#D1D5DB]',
              )}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

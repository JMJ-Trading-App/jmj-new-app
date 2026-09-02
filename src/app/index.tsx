import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WelcomeSlideContent } from '@/components/welcome/welcome-slide';
import { Button } from '@/components/ui/button';
import { PaginationDots } from '@/components/ui/pagination-dots';
import { WELCOME_SLIDES } from '@/constants/welcome-slides';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AUTO_SLIDE_MS = 2000;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(0);
  const listRef = useRef<FlatList<(typeof WELCOME_SLIDES)[number]>>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (carouselHeight <= 0 || WELCOME_SLIDES.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % WELCOME_SLIDES.length;
      listRef.current?.scrollToOffset({
        offset: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }, AUTO_SLIDE_MS);

    return () => clearInterval(timer);
  }, [carouselHeight, activeIndex]);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width,
    );

    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  }

  function handleCarouselLayout(event: LayoutChangeEvent) {
    const nextHeight = event.nativeEvent.layout.height;

    if (nextHeight !== carouselHeight) {
      setCarouselHeight(nextHeight);
    }
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <View
        className="flex-1"
        style={{ marginTop: -insets.top }}
        onLayout={handleCarouselLayout}>
        {carouselHeight > 0 ? (
          <FlatList
            ref={listRef}
            bounces={false}
            className="flex-1"
            data={WELCOME_SLIDES}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            horizontal
            keyExtractor={(_, index) => String(index)}
            pagingEnabled
            renderItem={({ item }) => (
              <WelcomeSlideContent
                height={carouselHeight}
                slide={item}
                topInset={insets.top}
              />
            )}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        ) : null}
      </View>

      <View
        className="gap-8 bg-black px-6 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <PaginationDots activeIndex={activeIndex} total={WELCOME_SLIDES.length} />
        <Button label="Get Started" variant="inverse" onPress={() => router.push('/onboarding/setup')} />
      </View>
    </View>
  );
}

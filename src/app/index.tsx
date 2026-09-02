import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WelcomeSlideContent } from '@/components/welcome/welcome-slide';
import { Button } from '@/components/ui/button';
import { PaginationDots } from '@/components/ui/pagination-dots';
import { WELCOME_SLIDES } from '@/constants/welcome-slides';
import { Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<(typeof WELCOME_SLIDES)[number]>>(null);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width,
    );

    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        ref={listRef}
        bounces={false}
        data={WELCOME_SLIDES}
        horizontal
        keyExtractor={(_, index) => String(index)}
        pagingEnabled
        renderItem={({ item }) => <WelcomeSlideContent slide={item} />}
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        onMomentumScrollEnd={handleScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.four) }]}>
        <PaginationDots activeIndex={activeIndex} total={WELCOME_SLIDES.length} />
        <Button label="Get Started" variant="inverse" onPress={() => router.push('/onboarding/setup')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  carousel: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.five,
    backgroundColor: '#000000',
  },
});

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, useWindowDimensions, View } from 'react-native';

import type { WelcomeSlide } from '@/constants/welcome-slides';

const IMAGE_TOP_MARGIN = 100;
export const WELCOME_MESSAGE_HEIGHT = 128;

type WelcomeSlideContentProps = {
  height: number;
  slide: WelcomeSlide;
  topInset?: number;
  width?: number;
};

export function WelcomeSlideContent({
  slide,
  height,
  topInset = 0,
  width,
}: WelcomeSlideContentProps) {
  const { width: windowWidth } = useWindowDimensions();
  const slideWidth = width ?? windowWidth;

  return (
    <View className="bg-black" style={{ width: slideWidth, height }}>
      <View
        className="absolute left-0 right-0"
        style={{
          top: -topInset + IMAGE_TOP_MARGIN,
          bottom: WELCOME_MESSAGE_HEIGHT,
        }}>
        <Image
          source={slide.hero}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)', '#000000']}
          locations={[0.42, 0.65, 0.82, 1]}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />
      </View>

      <View
        className="absolute bottom-0 left-0 right-0 justify-start px-6 pt-1"
        style={{ height: WELCOME_MESSAGE_HEIGHT }}>
        <Text className="px-1 text-center font-geist-medium text-[22px] leading-8 text-white">
          {slide.message}
        </Text>
      </View>
    </View>
  );
}

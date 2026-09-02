import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export const SplashColors = {
  yellow: '#F5C518',
} as const;

type SplashOverlayProps = {
  ready: boolean;
};

export function SplashOverlay({ ready }: SplashOverlayProps) {
  const [visible, setVisible] = useState(true);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!ready) {
      return;
    }

    SplashScreen.hideAsync()
      .catch(() => undefined)
      .finally(() => {
        opacity.value = withTiming(0, { duration: 400 }, (finished) => {
          if (finished) {
            runOnJS(setVisible)(false);
          }
        });
      });
  }, [opacity, ready]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View pointerEvents={ready ? 'none' : 'auto'} style={[styles.overlay, animatedStyle]}>
      <Image
        source={require('@/assets/images/splash-screen.png')}
        style={styles.image}
        contentFit="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SplashColors.yellow,
    zIndex: 1000,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

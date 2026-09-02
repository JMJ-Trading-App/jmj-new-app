import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet, Text, View } from "react-native";

import type { WelcomeSlide } from "@/constants/welcome-slides";
import { Fonts, Spacing } from "@/constants/theme";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
export const WELCOME_HERO_HEIGHT = SCREEN_HEIGHT * 0.65;

type WelcomeSlideContentProps = {
  slide: WelcomeSlide;
};

export function WelcomeSlideContent({ slide }: WelcomeSlideContentProps) {
  return (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <View style={[styles.hero, { height: WELCOME_HERO_HEIGHT }]}>
        <Image
          source={slide.hero}
          style={styles.heroImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.35)", "#000000"]}
          locations={[0.45, 0.75, 1]}
          style={styles.heroGradient}
        />
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.message}>{slide.message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: "#000000",
  },
  hero: {
    width: "100%",
    overflow: "hidden",
  },
  heroImage: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "6%",
    height: "106%",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    minHeight: 96,
  },
  message: {
    fontFamily: Fonts.medium,
    fontSize: 22,
    lineHeight: 32,
    color: "#FFFFFF",
    textAlign: "center",
    paddingHorizontal: Spacing.two,
  },
});

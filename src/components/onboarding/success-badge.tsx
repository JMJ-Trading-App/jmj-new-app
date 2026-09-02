import { Image } from 'expo-image';
import { View } from 'react-native';

const BADGE_SIZE = 112;
const ICON_SIZE = 56;

export function SuccessBadge() {
  return (
    <View
      className="items-center justify-center bg-brand"
      style={{
        width: BADGE_SIZE,
        height: BADGE_SIZE,
        borderRadius: BADGE_SIZE / 2,
      }}>
      <Image
        source={require('@/assets/images/onboarding/success-badge.png')}
        style={{ width: ICON_SIZE, height: ICON_SIZE }}
        contentFit="contain"
      />
    </View>
  );
}

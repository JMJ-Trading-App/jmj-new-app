import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { UpgradeArrowGraphic } from '@/components/more/more-icons';
import { MORE_UPGRADE } from '@/constants/more-data';

type UpgradeBannerProps = {
  onPress?: () => void;
};

export function UpgradeBanner({ onPress }: UpgradeBannerProps) {
  return (
    <View className="overflow-hidden rounded-[20px] bg-[#1C1917]">
      <View className="absolute -left-2 bottom-0 top-0 justify-center opacity-90">
        <UpgradeArrowGraphic size={88} />
      </View>

      <View className="flex-row items-center gap-3 px-4 py-4 pl-[78px]">
        <View className="min-w-0 flex-1 gap-1">
          <Text className="font-geist-bold text-[16px] text-white">{MORE_UPGRADE.title}</Text>
          <Text className="font-geist text-[12px] leading-[17px] text-white/70">
            {MORE_UPGRADE.subtitle}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={MORE_UPGRADE.cta}
          onPress={onPress}
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
          <LinearGradient
            colors={['#F5C518', '#C4A015']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 }}>
            <Text className="font-geist-semibold text-[13px] text-stone-title">
              {MORE_UPGRADE.cta}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

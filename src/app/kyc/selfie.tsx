import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import Svg, { Ellipse } from 'react-native-svg';
import { Pressable, Text, View } from 'react-native';

import { KycFlowShell } from '@/components/kyc/kyc-flow-shell';
import { CheckmarkBadgeIcon } from '@/components/pool/pool-icons';
import { KYC_SELFIE_TIPS } from '@/constants/kyc-data';

const FRAME_SIZE = 280;

export default function KycSelfieScreen() {
  return (
    <KycFlowShell
      title="Selfie Verification"
      step={2}
      footer={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Take Photo"
          onPress={() => router.push('/kyc/proof-of-address' as Href)}
          className="flex-row items-center justify-center gap-2 rounded-[14px] bg-stone-title py-[18px]"
          style={({ pressed }) => [pressed && { opacity: 0.88 }]}>
          <SymbolView name="camera.fill" size={18} tintColor="#FFFFFF" />
          <Text className="font-geist-semibold text-[16px] text-white">Take Photo</Text>
        </Pressable>
      }>
      <View className="flex-1 items-center gap-8">
        <View
          className="items-center justify-center rounded-full border-2 border-[#F5E8B0] bg-[#5C5C5C]"
          style={{ width: FRAME_SIZE, height: FRAME_SIZE }}>
          <Svg width={FRAME_SIZE * 0.72} height={FRAME_SIZE * 0.88}>
            <Ellipse
              cx={(FRAME_SIZE * 0.72) / 2}
              cy={(FRAME_SIZE * 0.88) / 2}
              rx={(FRAME_SIZE * 0.72) / 2 - 2}
              ry={(FRAME_SIZE * 0.88) / 2 - 2}
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeDasharray="8 7"
              fill="none"
            />
          </Svg>
        </View>

        <View className="w-full gap-4 px-1">
          {KYC_SELFIE_TIPS.map((tip) => (
            <View key={tip} className="flex-row items-center gap-3">
              <CheckmarkBadgeIcon size={22} />
              <Text className="flex-1 font-geist text-[15px] leading-[22px] text-stone-title">
                {tip}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </KycFlowShell>
  );
}

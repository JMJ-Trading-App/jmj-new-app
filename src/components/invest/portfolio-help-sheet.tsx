import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon, CycleClockIcon } from '@/components/invest/invest-icons';
import { CheckmarkBadgeIcon } from '@/components/pool/pool-icons';

const GAINS = [
  'Passive profit opportunities',
  'Professional trade management',
  'Reduced emotional trading',
  'Structured risk management',
  'Consistent market monitoring',
] as const;

type PortfolioHelpSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function PortfolioHelpSheet({ visible, onClose }: PortfolioHelpSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" className="flex-1" onPress={onClose} />

        <View
          className="rounded-t-[28px] bg-white px-5 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
          <View className="mb-4 items-center">
            <View className="h-1 w-10 rounded-full bg-[#D1D5DB]" />
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-geist-bold text-[20px] text-stone-title">Portfolio Management</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6]">
              <CloseIcon />
            </Pressable>
          </View>

          <Text className="font-geist text-[15px] leading-[22px] text-stone-body">
            JMJ trades on your behalf using professional risk management and market analysis
            strategies.
          </Text>

          <View className="mt-6 gap-2">
            <Text className="font-geist-medium text-[13px] text-muted">How It Works</Text>
            <Text className="font-geist text-[15px] leading-[22px] text-stone-title">
              Our team manages trades over 8-12 weeks per cycle.
            </Text>
          </View>

          <View className="mt-6 gap-3">
            <Text className="font-geist-medium text-[13px] text-muted">What You Gain</Text>
            {GAINS.map((item) => (
              <View key={item} className="flex-row items-start gap-3">
                <View className="mt-0.5">
                  <CheckmarkBadgeIcon size={20} />
                </View>
                <Text className="flex-1 font-geist text-[15px] leading-[22px] text-stone-title">
                  {item}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-6 flex-row items-center gap-3 rounded-[16px] bg-brand-tint px-4 py-3.5">
            <CycleClockIcon />
            <Text className="flex-1 font-geist-medium text-[14px] text-stone-title">
              Results typically within 8-12 weeks.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

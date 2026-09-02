import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon } from '@/components/invest/invest-icons';
import { CheckmarkBadgeIcon } from '@/components/pool/pool-icons';

const HOW_IT_WORKS = [
  'Browse available pools and choose one that fits your goals',
  'Enter your contribution amount (min varies per pool)',
  'Pay the 2.5% service charge — your capital goes directly to the pool',
  'JMJ manages the pooled funds using professional trading strategies on MetaTrader',
  'Profits are distributed proportionally based on your share of the pool',
] as const;

const GAINS = [
  'Access to larger trading opportunities',
  'Increased scalability',
  'Shared risk exposure',
  'Passive income opportunities',
  'Professional fund management',
] as const;

type PoolHelpSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function PoolHelpSheet({ visible, onClose }: PoolHelpSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          className="flex-1"
          onPress={onClose}
        />

        <View
          className="max-h-[88%] rounded-t-[28px] bg-white pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
          <View className="mb-3 items-center px-5">
            <View className="h-1 w-10 rounded-full bg-[#D1D5DB]" />
          </View>

          <View className="mb-2 flex-row items-center justify-between px-5">
            <Text className="font-geist-bold text-[20px] text-stone-title">About Pool Funding</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6]">
              <CloseIcon />
            </Pressable>
          </View>

          <ScrollView
            className="flex-grow-0"
            contentContainerClassName="gap-6 px-5 pb-2 pt-2"
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <View className="gap-2">
              <Text className="font-geist-bold text-[15px] text-[#C4A015]">What Is Pool Funding?</Text>
              <Text className="font-geist text-[15px] leading-[22px] text-stone-body">
                Pool Funding is a service that allows multiple investors to combine funds together in
                order to leverage larger trading opportunities and increase overall earning
                potential.
              </Text>
            </View>

            <View className="gap-3">
              <Text className="font-geist-bold text-[15px] text-[#C4A015]">How It Works</Text>
              {HOW_IT_WORKS.map((item, index) => (
                <View key={item} className="flex-row items-start gap-3">
                  <Text className="w-4 font-geist-bold text-[15px] leading-[22px] text-[#C4A015]">
                    {index + 1}.
                  </Text>
                  <Text className="flex-1 font-geist text-[15px] leading-[22px] text-stone-title">
                    {item}
                  </Text>
                </View>
              ))}
            </View>

            <View className="gap-3">
              <Text className="font-geist-bold text-[15px] text-[#C4A015]">What You Gain</Text>
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

            <View className="rounded-[16px] bg-brand-tint px-4 py-3.5">
              <Text className="font-geist text-[13px] leading-[19px] text-stone-title">
                Every investment typically delivers results within 8–12 weeks. Profit target across
                all pools: 175%. Past performance does not guarantee future results. You can monitor
                progress directly from the portfolio dashboard.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

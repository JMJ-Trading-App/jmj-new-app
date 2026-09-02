import { Pressable, Text, View } from 'react-native';

import { HelpIcon } from '@/components/invest/invest-icons';

type InvestHeaderProps = {
  onHelpPress?: () => void;
};

export function InvestHeader({ onHelpPress }: InvestHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="font-geist-bold text-[28px] leading-[34px] text-stone-title">Invest</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Help"
        onPress={onHelpPress}
        className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
        <HelpIcon />
      </Pressable>
    </View>
  );
}

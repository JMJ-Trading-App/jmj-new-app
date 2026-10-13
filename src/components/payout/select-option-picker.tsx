import { SymbolView } from 'expo-symbols';
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SelectOption } from '@/constants/payout-account-data';
import { cn } from '@/lib/cn';

type SelectOptionPickerProps = {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedId: string | null;
  onClose: () => void;
  onSelect: (option: SelectOption) => void;
};

export function SelectOptionPicker({
  visible,
  title,
  options,
  selectedId,
  onClose,
  onSelect,
}: SelectOptionPickerProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const listMaxHeight = Math.round(height * 0.55);

  return (
    <Modal
      animationType="slide"
      statusBarTranslucent
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable accessibilityRole="button" className="flex-1" onPress={onClose} />

        <View
          className="rounded-t-[24px] bg-white px-5 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          <View className="mb-4 items-center">
            <View className="h-1 w-10 rounded-full bg-[#D1D5DB]" />
          </View>

          <Text className="mb-4 font-geist-bold text-[18px] text-stone-title">{title}</Text>

          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
            style={{ maxHeight: listMaxHeight }}
            className="rounded-[16px] border border-[#EFEFEF]">
            {options.map((option, index) => {
              const selected = option.id === selectedId;
              const isLast = index === options.length - 1;

              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  className={cn(
                    'flex-row items-center justify-between px-4 py-4',
                    !isLast && 'border-b border-[#F3F4F6]',
                    selected && 'bg-[#FFF8E9]',
                  )}
                  style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
                  <Text
                    numberOfLines={1}
                    className={cn(
                      'min-w-0 flex-1 pr-3 font-geist-medium text-[15px]',
                      selected ? 'text-stone-title' : 'text-stone-body',
                    )}>
                    {option.label}
                  </Text>
                  {selected ? (
                    <SymbolView
                      name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                      size={16}
                      tintColor="#C4A015"
                      weight="semibold"
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

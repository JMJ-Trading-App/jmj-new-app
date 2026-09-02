import { Modal, Pressable, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

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
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable accessibilityRole="button" className="flex-1" onPress={onClose} />

        <View className="rounded-t-[24px] bg-white px-5 pb-8 pt-3">
          <View className="mb-4 items-center">
            <View className="h-1 w-10 rounded-full bg-[#D1D5DB]" />
          </View>

          <Text className="mb-4 font-geist-bold text-[18px] text-stone-title">{title}</Text>

          <View className="overflow-hidden rounded-[16px] border border-[#EFEFEF]">
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
                    className={cn(
                      'font-geist-medium text-[15px]',
                      selected ? 'text-stone-title' : 'text-stone-body',
                    )}>
                    {option.label}
                  </Text>
                  {selected ? (
                    <SymbolView name="checkmark" size={16} tintColor="#C4A015" weight="semibold" />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

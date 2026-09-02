import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import type { OccupationOption } from '@/constants/occupation-data';
import { cn } from '@/lib/cn';

type OccupationOptionSheetProps = {
  visible: boolean;
  title: string;
  options: OccupationOption[];
  selectedId: string | null;
  onClose: () => void;
  onSelect: (option: OccupationOption) => void;
};

export function OccupationOptionSheet({
  visible,
  title,
  options,
  selectedId,
  onClose,
  onSelect,
}: OccupationOptionSheetProps) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable accessibilityRole="button" className="flex-1" onPress={onClose} />

        <View className="max-h-[78%] rounded-t-[28px] bg-[#F7F5F0] px-5 pb-10 pt-5">
          <Text className="mb-5 text-center font-geist-bold text-[18px] text-stone-title">
            {title}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 pb-2">
            {options.map((option) => {
              const selected = option.id === selectedId;

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
                    'items-center rounded-[16px] border px-4 py-4',
                    selected
                      ? 'border-stone-title bg-white'
                      : 'border-[#E8E4DA] bg-[#FFFDF8]',
                  )}
                  style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
                  <Text
                    className={cn(
                      'font-geist-medium text-[15px]',
                      selected ? 'text-stone-title' : 'text-stone-body',
                    )}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

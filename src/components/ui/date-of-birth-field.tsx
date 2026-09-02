import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { FieldBorderState } from '@/constants/theme';
import {
  formatDateFromPicker,
  formatDateOfBirth,
  getDefaultDateOfBirthPickerDate,
  parseDateOfBirth,
} from '@/lib/date-of-birth';
import { cn } from '@/lib/cn';
import { getFieldBorderClass } from '@/lib/field-border';

type DateOfBirthFieldProps = {
  borderState?: FieldBorderState;
  onChangeText: (value: string) => void;
  value: string;
  className?: string;
};

export function DateOfBirthField({
  borderState,
  onChangeText,
  value,
  className,
}: DateOfBirthFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(getDefaultDateOfBirthPickerDate());

  const resolvedBorderState = focused ? 'focused' : (borderState ?? 'default');
  const maximumDate = useMemo(() => new Date(), []);

  function openPicker() {
    setPickerDate(parseDateOfBirth(value) ?? getDefaultDateOfBirthPickerDate());
    setShowPicker(true);
  }

  function handlePickerChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }

    setPickerDate(selectedDate);
    onChangeText(formatDateFromPicker(selectedDate));
  }

  function handleConfirm() {
    onChangeText(formatDateFromPicker(pickerDate));
    setShowPicker(false);
  }

  return (
    <View className={cn('gap-1.5', className)}>
      <View
        className={cn(
          'border bg-input rounded-field px-4 pt-2 pb-2.5 gap-0.5',
          getFieldBorderClass(resolvedBorderState),
        )}>
        <ThemedText type="fieldLabel" themeColor="textMuted">
          Date of Birth
        </ThemedText>

        <View className="flex-row items-center min-h-[24px]">
          <TextInput
            keyboardType="number-pad"
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#6B7280"
            className="flex-1 p-0 text-foreground font-geist text-base"
            style={{ fontSize: 16, paddingVertical: 0 }}
            value={value}
            onBlur={() => setFocused(false)}
            onChangeText={(text) => onChangeText(formatDateOfBirth(text))}
            onFocus={() => setFocused(true)}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open date picker"
            hitSlop={8}
            onPress={openPicker}
            className="w-7 h-7 items-center justify-center ml-1">
            <SymbolView name="calendar" size={20} tintColor="#6B7280" weight="regular" />
          </Pressable>
        </View>
      </View>

      {Platform.OS === 'android' && showPicker ? (
        <DateTimePicker
          display="default"
          maximumDate={maximumDate}
          mode="date"
          value={pickerDate}
          onChange={handlePickerChange}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal animationType="slide" transparent visible={showPicker} onRequestClose={() => setShowPicker(false)}>
          <Pressable className="flex-1 justify-end bg-black/35" onPress={() => setShowPicker(false)}>
            <Pressable className="bg-background rounded-t-[20px] pb-6">
              <View className="flex-row items-center justify-between px-6 py-4">
                <Pressable onPress={() => setShowPicker(false)}>
                  <ThemedText type="body" themeColor="textMuted">
                    Cancel
                  </ThemedText>
                </Pressable>
                <Pressable onPress={handleConfirm}>
                  <ThemedText type="body" className="font-geist-semibold">
                    Done
                  </ThemedText>
                </Pressable>
              </View>

              <DateTimePicker
                display="spinner"
                maximumDate={maximumDate}
                mode="date"
                themeVariant="light"
                value={pickerDate}
                onChange={(_, selectedDate) => {
                  if (selectedDate) {
                    setPickerDate(selectedDate);
                  }
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
}

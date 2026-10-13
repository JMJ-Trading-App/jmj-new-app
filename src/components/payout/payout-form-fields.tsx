import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { cn } from '@/lib/cn';

type PayoutSelectFieldProps = {
  label: string;
  value: string | null;
  placeholder?: string;
  onPress: () => void;
};

export function PayoutSelectField({
  label,
  value,
  placeholder = 'Select...',
  onPress,
}: PayoutSelectFieldProps) {
  return (
    <View className="gap-2">
      <Text className="font-geist-semibold text-[11px] tracking-[0.08em] text-muted">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        className="flex-row items-center justify-between rounded-[14px] bg-[#F3F4F6] px-4 py-[16px]"
        style={({ pressed }) => [pressed && { opacity: 0.92 }]}>
        <Text
          numberOfLines={1}
          className={cn(
            'min-w-0 flex-1 font-geist text-[15px]',
            value ? 'text-stone-title' : 'text-[#9CA3AF]',
          )}>
          {value ?? placeholder}
        </Text>
        <SymbolView
          name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
          size={18}
          tintColor="#9CA3AF"
          weight="medium"
        />
      </Pressable>
    </View>
  );
}

type PayoutTextFieldProps = TextInputProps & {
  label: string;
};

export function PayoutTextField({ label, value, className, style, ...rest }: PayoutTextFieldProps & { className?: string }) {
  return (
    <View className={cn('gap-2', className)}>
      <Text className="font-geist-semibold text-[11px] tracking-[0.08em] text-muted">{label}</Text>
      <View className="rounded-[14px] bg-[#F3F4F6] px-4 py-[14px]">
        <TextInput
          {...rest}
          value={value}
          placeholderTextColor="#9CA3AF"
          className="p-0 font-geist text-[15px] text-stone-title"
          style={[{ fontSize: 15, lineHeight: undefined, paddingVertical: 0 }, style]}
        />
      </View>
    </View>
  );
}

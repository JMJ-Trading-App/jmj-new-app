import { Pressable, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { cn } from '@/lib/cn';

type OccupationSelectRowProps = {
  label: string;
  value: string;
  onPress: () => void;
  showDivider?: boolean;
};

export function OccupationSelectRow({
  label,
  value,
  onPress,
  showDivider = true,
}: OccupationSelectRowProps) {
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        className="flex-row items-center justify-between gap-3 py-4"
        style={({ pressed }) => [pressed && { opacity: 0.88 }]}>
        <View className="min-w-0 flex-1 gap-1">
          <Text className="font-geist text-[13px] text-muted">{label}</Text>
          <Text className="font-geist-bold text-[17px] text-stone-title" numberOfLines={1}>
            {value}
          </Text>
        </View>
        <SymbolView name="chevron.down" size={16} tintColor="#9CA3AF" weight="medium" />
      </Pressable>
      {showDivider ? <View className="h-px bg-[#E8E4DA]" /> : null}
    </View>
  );
}

type OccupationFormCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function OccupationFormCard({ children, className }: OccupationFormCardProps) {
  return (
    <View className={cn('rounded-[22px] bg-[#F3EFE6] px-4', className)}>{children}</View>
  );
}

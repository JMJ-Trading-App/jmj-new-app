import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type WarningTone = 'amber' | 'blue';

const TONE_STYLES: Record<WarningTone, { box: string; text: string; icon: string }> = {
  amber: {
    box: 'border-[#E8D9A8] bg-[#FFF8E9]',
    text: 'text-[#8A6D10]',
    icon: '#8A6D10',
  },
  blue: {
    box: 'border-[#BFDBFE] bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    icon: '#1D4ED8',
  },
};

function WarningTriangleIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4L21 20H3L12 4Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M12 10V14" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M12 17.2V17.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

type PayoutInfoCalloutProps = {
  message: string;
  tone?: WarningTone;
};

export function PayoutInfoCallout({ message, tone = 'amber' }: PayoutInfoCalloutProps) {
  const styles = TONE_STYLES[tone];

  return (
    <View className={`flex-row items-start gap-2.5 rounded-[14px] border px-3.5 py-3 ${styles.box}`}>
      <View className="mt-0.5">
        <WarningTriangleIcon color={styles.icon} />
      </View>
      <Text className={`min-w-0 flex-1 font-geist text-[13px] leading-[18px] ${styles.text}`}>
        {message}
      </Text>
    </View>
  );
}

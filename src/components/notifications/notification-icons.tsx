import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { NotificationItem } from '@/constants/notifications-data';

type IconProps = {
  color?: string;
  size?: number;
};

function ShieldCheckIcon({ color = '#166534', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5L5.5 6.2V11.5C5.5 15.8 8.4 19.6 12 20.5C15.6 19.6 18.5 15.8 18.5 11.5V6.2L12 3.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M9 12L11 14L15.5 9.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ArrowDownLeftIcon({ color = '#92400E', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M16.5 7.5L7.5 16.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path
        d="M7.5 9.5V16.5H14.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ArrowUpRightIcon({ color = '#1D4ED8', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7.5 16.5L16.5 7.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path
        d="M9.5 7.5H16.5V14.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PeopleIcon({ color = '#166534', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={9} r={2.5} stroke={color} strokeWidth={1.5} />
      <Circle cx={16} cy={10} r={2} stroke={color} strokeWidth={1.5} />
      <Path
        d="M4.5 17.5C4.5 15.3 6.3 13.5 9 13.5C11.7 13.5 13.5 15.3 13.5 17.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M14 17.5C14 15.9 15.1 14.5 16.8 14.5C18.5 14.5 19.5 15.9 19.5 17.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ChartCheckIcon({ color = '#166534', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={12} width={3} height={7} rx={0.8} fill={color} />
      <Rect x={10.5} y={8} width={3} height={11} rx={0.8} fill={color} />
      <Rect x={16} y={5} width={3} height={14} rx={0.8} fill={color} />
      <Path
        d="M14.5 4.5L16 6L19.5 2.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const ICON_STYLES: Record<
  NotificationItem['icon'],
  { bg: string; color: string; Icon: (props: IconProps) => React.JSX.Element }
> = {
  kyc: { bg: '#DCFCE7', color: '#166534', Icon: ShieldCheckIcon },
  funded: { bg: '#FEF3C7', color: '#92400E', Icon: ArrowDownLeftIcon },
  payout: { bg: '#DBEAFE', color: '#1D4ED8', Icon: ArrowUpRightIcon },
  'pool-complete': { bg: '#DCFCE7', color: '#166534', Icon: PeopleIcon },
  'investment-confirmed': { bg: '#DCFCE7', color: '#166534', Icon: ChartCheckIcon },
  'new-pool': { bg: '#1C1917', color: '#FFFFFF', Icon: PeopleIcon },
  withdrawal: { bg: '#F3F4F6', color: '#1C1917', Icon: ArrowUpRightIcon },
};

export function NotificationTypeIcon({ type }: { type: NotificationItem['icon'] }) {
  const { bg, color, Icon } = ICON_STYLES[type];

  return (
    <View className="h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: bg }}>
      <Icon color={color} size={20} />
    </View>
  );
}

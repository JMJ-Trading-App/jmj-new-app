import { Image } from 'expo-image';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
};

export function BellIcon({ color = '#1C1917', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.5 9.5C6.5 6.46243 8.96243 4 12 4C15.0376 4 17.5 6.46243 17.5 9.5V13.2L19 16H5L6.5 13.2V9.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M10 18C10.4 19.2 11.1 20 12 20C12.9 20 13.6 19.2 14 18"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function EyeIcon({ color = '#FFFFFF', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.5 12C4.5 7.5 8 5 12 5C16 5 19.5 7.5 21.5 12C19.5 16.5 16 19 12 19C8 19 4.5 16.5 2.5 12Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}

export function TrendIcon({
  color = '#166534',
  size = 14,
  direction = 'up',
}: IconProps & { direction?: 'up' | 'down' }) {
  return (
    <View
      style={
        direction === 'down'
          ? { transform: [{ rotate: '180deg' }] }
          : undefined
      }>
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <Path
          d="M2 11L5.5 7.5L8 10L14 4"
          stroke={color}
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M10.5 4H14V7.5"
          stroke={color}
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export function HandTapIcon({ color = '#8E8E8E', size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M12.3333 1.33447V5.33447M12.3333 1.33447C11.8665 1.33447 10.9943 2.66401 10.6667 3.00114M12.3333 1.33447C12.8001 1.33447 13.6723 2.66401 14 3.00114"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.2609 14.6652C10.2263 13.3892 10.3123 13.2355 10.4035 12.9516C10.4946 12.6678 11.1321 11.6442 11.3577 10.9128C12.0875 8.54664 11.4073 8.04337 10.5005 7.37237C9.4948 6.62822 7.59787 6.25136 6.65715 6.33295V2.49731C6.65715 1.85509 6.13654 1.33447 5.49432 1.33447C4.85211 1.33447 4.33149 1.85509 4.33149 2.49731V6.64389M4.33149 6.64389L3.09765 7.74011C2.27063 8.52197 2.10219 8.97944 2.03727 9.25637C1.91125 9.79804 2.08339 10.3838 2.88448 11.5442C3.66353 12.6155 4.28885 13.3605 4.33183 13.9901V14.6657M4.33149 6.64389V9.35471"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LinkIcon({ color = '#FFFFFF', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 13C10.4 13.5 11 13.9 11.7 14.1C12.4 14.3 13.2 14.2 13.8 13.8L16.8 10.8C17.8 9.8 17.8 8.2 16.8 7.2C15.8 6.2 14.2 6.2 13.2 7.2L12.5 7.9"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 11C13.6 10.5 13 10.1 12.3 9.9C11.6 9.7 10.8 9.8 10.2 10.2L7.2 13.2C6.2 14.2 6.2 15.8 7.2 16.8C8.2 17.8 9.8 17.8 10.8 16.8L11.5 16.1"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CandlesIcon({ color = '#FFFFFF', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 16V8C14 7.05719 14 6.58579 13.7071 6.29289C13.4142 6 12.9428 6 12 6C11.0572 6 10.5858 6 10.2929 6.29289C10 6.58579 10 7.05719 10 8V16C10 16.9428 10 17.4142 10.2929 17.7071C10.5858 18 11.0572 18 12 18C12.9428 18 13.4142 18 13.7071 17.7071C14 17.4142 14 16.9428 14 16Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 9V7C21 6.05719 21 5.58579 20.7071 5.29289C20.4142 5 19.9428 5 19 5C18.0572 5 17.5858 5 17.2929 5.29289C17 5.58579 17 6.05719 17 7V9C17 9.94281 17 10.4142 17.2929 10.7071C17.5858 11 18.0572 11 19 11C19.9428 11 20.4142 11 20.7071 10.7071C21 10.4142 21 9.94281 21 9Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 14V12C7 11.0572 7 10.5858 6.70711 10.2929C6.41421 10 5.94281 10 5 10C4.05719 10 3.58579 10 3.29289 10.2929C3 10.5858 3 11.0572 3 12V14C3 14.9428 3 15.4142 3.29289 15.7071C3.58579 16 4.05719 16 5 16C5.94281 16 6.41421 16 6.70711 15.7071C7 15.4142 7 14.9428 7 14Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 21V18" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19 13V11" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M12 6V3" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19 5V3" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M5 18V16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M5 10V8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function SignalsIcon({ color = '#FFFFFF', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 14.0015L7 10.0015C7.88256 9.1189 8.32385 8.67762 8.86543 8.62884C8.95496 8.62077 9.04504 8.62077 9.13457 8.62884C9.67615 8.67762 10.1174 9.1189 11 10.0015C11.8826 10.884 12.3238 11.3253 12.8654 11.3741C12.955 11.3822 13.045 11.3822 13.1346 11.3741C13.6762 11.3253 14.1174 10.884 15 10.0015L20 5.00146M16 15.0015L20 19.0015"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 19.7249C16 19.7249 20.101 20.3472 20.7234 19.7249C21.3458 19.1025 20.7234 15.0015 20.7234 15.0015"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 4.27658C16 4.27658 20.101 3.65426 20.7234 4.27661C21.3458 4.89896 20.7234 9 20.7234 9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ color = '#1C1917', size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6 3.5L10.5 8L6 12.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function EmptyActivityIcon({ color = '#D1D5DB', size = 48 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx={24} cy={24} r={20} stroke={color} strokeWidth={2} />
      <Path d="M24 14V28" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx={24} cy={34} r={1.8} fill={color} />
    </Svg>
  );
}

const RANK_BADGES = {
  basic: require('../../../assets/images/icons/basic.png'),
  pro: require('../../../assets/images/icons/pro.png'),
  vip: require('../../../assets/images/icons/vip.png'),
} as const;

export type RankTier = keyof typeof RANK_BADGES;

export function RankBadgeIcon({
  size = 16,
  tier = 'basic',
}: {
  size?: number;
  tier?: RankTier;
}) {
  return (
    <Image
      source={RANK_BADGES[tier]}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}

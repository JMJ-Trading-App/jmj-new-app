import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { View } from 'react-native';

type IconProps = {
  color?: string;
  size?: number;
};

export function HelpCallIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.5 4.5H10.5C11 4.5 11.4 4.8 11.5 5.3L12.2 8.2C12.3 8.7 12.1 9.2 11.7 9.5L10.2 10.6C11.1 12.4 12.6 13.9 14.4 14.8L15.5 13.3C15.8 12.9 16.3 12.7 16.8 12.8L19.7 13.5C20.2 13.6 20.5 14 20.5 14.5V17.5C20.5 18.6 19.6 19.5 18.5 19.5C11.6 19.5 5.5 13.4 5.5 6.5C5.5 5.4 6.4 4.5 7.5 4.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function HelpEmailIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={5.5} width={17} height={13} rx={2} stroke={color} strokeWidth={1.6} />
      <Path
        d="M4 7L12 13L20 7"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function HelpFaqIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.25} stroke={color} strokeWidth={1.6} />
      <Path
        d="M9.8 9.5C10 8.4 10.8 7.7 12 7.7C13.3 7.7 14.2 8.5 14.2 9.7C14.2 10.7 13.5 11.2 12.7 11.6C12 12 11.5 12.4 11.5 13.4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Circle cx={12} cy={16.4} r={1} fill={color} />
    </Svg>
  );
}

export function HelpInstagramIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={3.5} width={17} height={17} rx={5} stroke={color} strokeWidth={1.6} />
      <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.6} />
      <Circle cx={17.2} cy={6.8} r={1.1} fill={color} />
    </Svg>
  );
}

export function HelpXIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 6L18 18M18 6L6 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function HelpIconBadge({ children }: { children: React.ReactNode }) {
  return (
    <View className="h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white">
      {children}
    </View>
  );
}

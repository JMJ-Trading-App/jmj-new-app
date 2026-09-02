import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
};

export function HelpIcon({ color = '#1C1917', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.6} />
      <Path
        d="M9.6 9.4C9.8 8.2 10.7 7.5 12 7.5C13.3 7.5 14.3 8.3 14.3 9.5C14.3 10.5 13.6 11 12.8 11.4C12 11.8 11.5 12.2 11.5 13.2"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Circle cx={12} cy={16.2} r={1} fill={color} />
    </Svg>
  );
}

export function ArrowRightIcon({ color = '#FFFFFF', size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 7V17" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path
        d="M10 12H19M19 12L15 8M19 12L15 16"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CloseIcon({ color = '#1C1917', size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 7L17 17M17 7L7 17"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CycleClockIcon({ color = '#1C1917', size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 7V12L15 14"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke={color}
        strokeWidth={1.6}
      />
      <Path d="M9 3H15" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

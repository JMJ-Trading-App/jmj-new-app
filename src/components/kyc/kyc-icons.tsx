import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
};

export function KycIdCardIcon({ color = '#C4A015', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={6} width={17} height={12} rx={2.5} stroke={color} strokeWidth={1.6} />
      <Circle cx={9} cy={11.5} r={2} stroke={color} strokeWidth={1.5} />
      <Path d="M13.5 10.5H17.5M13.5 13.5H16.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path
        d="M6.5 15.5C7.1 14.4 8 13.8 9 13.8C10 13.8 10.9 14.4 11.5 15.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function KycCameraIcon({ color = '#C4A015', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.5 7.5L9.5 5.5H14.5L15.5 7.5H18.5C19.3 7.5 20 8.2 20 9V17C20 17.8 19.3 18.5 18.5 18.5H5.5C4.7 18.5 4 17.8 4 17V9C4 8.2 4.7 7.5 5.5 7.5H8.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12.5} r={3} stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}

export function KycAddressIcon({ color = '#C4A015', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21C12 21 5.5 15.8 5.5 10.8C5.5 7.2 8.4 4.5 12 4.5C15.6 4.5 18.5 7.2 18.5 10.8C18.5 15.8 12 21 12 21Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M9.8 11.2V13.5H14.2V11.2L12 9.5L9.8 11.2Z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <Path d="M12 9.5V8.2" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

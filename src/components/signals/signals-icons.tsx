import Svg, { Circle, Path } from 'react-native-svg';
import { View } from 'react-native';

type IconProps = {
  color?: string;
  size?: number;
};

export function TrendUpIcon({ color = '#16A34A', size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M2.5 11.5L6.2 7.8L8.8 10.4L13.5 5.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 5.5H13.5V9"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TrendDownIcon({ color = '#DC2626', size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M2.5 5.5L6.2 9.2L8.8 6.6L13.5 11.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 11.5H13.5V8"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LightbulbIcon({ color = '#C4A015', size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18H15"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Path
        d="M10 21H14"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Path
        d="M12 3C8.7 3 6.5 5.5 6.5 8.5C6.5 10.4 7.4 11.9 8.7 13.1C9.4 13.7 9.8 14.5 9.8 15.4V16H14.2V15.4C14.2 14.5 14.6 13.7 15.3 13.1C16.6 11.9 17.5 10.4 17.5 8.5C17.5 5.5 15.3 3 12 3Z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function AccessEndedBadge({ size = 88 }: { size?: number }) {
  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
        <Path
          d="M48 8L55.2 12.4L63.8 11.2L68.8 18.2L77.2 20.8L79.2 29.4L85.6 35.2L83.6 43.8L85.6 52.4L79.2 58.2L77.2 66.8L68.8 69.4L63.8 76.4L55.2 75.2L48 79.6L40.8 75.2L32.2 76.4L27.2 69.4L18.8 66.8L16.8 58.2L10.4 52.4L12.4 43.8L10.4 35.2L16.8 29.4L18.8 20.8L27.2 18.2L32.2 11.2L40.8 12.4L48 8Z"
          fill="#FCE7F3"
        />
        <Circle cx={48} cy={48} r={22} fill="#E11D48" />
        <Path
          d="M40 40L56 56M56 40L40 56"
          stroke="#FFFFFF"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <Circle cx={22} cy={28} r={3} fill="#FDA4AF" />
        <Circle cx={74} cy={30} r={2.5} fill="#FECDD3" />
        <Circle cx={70} cy={68} r={3} fill="#F9A8D4" />
        <Circle cx={28} cy={66} r={2} fill="#FDA4AF" />
      </Svg>
    </View>
  );
}

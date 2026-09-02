import Svg, { Circle, Path } from 'react-native-svg';
import { View } from 'react-native';

export function TwoFactorHero({ size = 120 }: { size?: number }) {
  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <View
        className="items-center justify-center bg-[#FFF4C2]"
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.38,
        }}>
        <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
          <Path
            d="M28 8L42 14V26C42 35.2 36.2 43.2 28 46C19.8 43.2 14 35.2 14 26V14L28 8Z"
            stroke="#C4A015"
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
          <Path
            d="M22 27.5L26 31.5L35 22.5"
            stroke="#C4A015"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </View>
  );
}

export function SmsMethodIcon({ size = 40 }: { size?: number }) {
  return (
    <View
      className="items-center justify-center rounded-[12px] bg-[#FFF4C2]"
      style={{ width: size, height: size }}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M7.5 4.5H10.5C11 4.5 11.4 4.8 11.5 5.3L12.2 8.2C12.3 8.7 12.1 9.2 11.7 9.5L10.2 10.6C11.1 12.4 12.6 13.9 14.4 14.8L15.5 13.3C15.8 12.9 16.3 12.7 16.8 12.8L19.7 13.5C20.2 13.6 20.5 14 20.5 14.5V17.5C20.5 18.6 19.6 19.5 18.5 19.5C11.6 19.5 5.5 13.4 5.5 6.5C5.5 5.4 6.4 4.5 7.5 4.5Z"
          stroke="#C4A015"
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export function TwoFactorSuccessBadge({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <Path
        d="M48 8L55.2 12.4L63.8 11.2L68.8 18.2L77.2 20.8L79.2 29.4L85.6 35.2L83.6 43.8L85.6 52.4L79.2 58.2L77.2 66.8L68.8 69.4L63.8 76.4L55.2 75.2L48 79.6L40.8 75.2L32.2 76.4L27.2 69.4L18.8 66.8L16.8 58.2L10.4 52.4L12.4 43.8L10.4 35.2L16.8 29.4L18.8 20.8L27.2 18.2L32.2 11.2L40.8 12.4L48 8Z"
        fill="#DCFCE7"
      />
      <Path
        d="M48 26L62 32V42C62 50.4 56.2 57.6 48 60C39.8 57.6 34 50.4 34 42V32L48 26Z"
        fill="#16A34A"
      />
      <Path
        d="M42 43L46.5 47.5L55 39"
        stroke="#FFFFFF"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={22} cy={28} r={3} fill="#93C5FD" />
      <Circle cx={74} cy={30} r={2.5} fill="#86EFAC" />
      <Circle cx={70} cy={68} r={3} fill="#F9A8D4" />
      <Circle cx={28} cy={66} r={2} fill="#86EFAC" />
    </Svg>
  );
}

import Svg, { Path, Rect } from 'react-native-svg';
import { View } from 'react-native';

export function ChangePasswordHero({ size = 120 }: { size?: number }) {
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
            d="M18 16V14C18 9.58172 21.5817 6 26 6H30C34.4183 6 38 9.58172 38 14V16"
            stroke="#C4A015"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <Rect
            x={14}
            y={16}
            width={28}
            height={24}
            rx={4}
            stroke="#C4A015"
            strokeWidth={2.4}
          />
          <Path
            d="M28 24V30"
            stroke="#C4A015"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <Path
            d="M10 20V36M46 20V36"
            stroke="#C4A015"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <Path
            d="M8 22H12M44 22H48M8 34H12M44 34H48"
            stroke="#C4A015"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </View>
  );
}

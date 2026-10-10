import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
};

export function ProfileIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={3.25} stroke={color} strokeWidth={1.6} />
      <Path
        d="M5.5 19.2C6.4 16.7 8.8 15 12 15C15.2 15 17.6 16.7 18.5 19.2"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function EditProfileIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={10} cy={8} r={3} stroke={color} strokeWidth={1.6} />
      <Path
        d="M4.5 18.5C5.3 16.4 7.4 15 10 15C11.1 15 12.1 15.2 13 15.7"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Path
        d="M17 14V20M14 17H20"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function KycShieldIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5L19 6.5V11.5C19 15.8 16.2 19.4 12 20.5C7.8 19.4 5 15.8 5 11.5V6.5L12 3.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M9.2 12L11.1 13.9L15 10"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function OccupationIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 8V6.8C8 5.8 8.8 5 9.8 5H14.2C15.2 5 16 5.8 16 6.8V8"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Rect x={4.5} y={8} width={15} height={11} rx={2} stroke={color} strokeWidth={1.6} />
      <Path d="M4.5 12.5H19.5" stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}

export function PayoutCardIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3.5} y={6} width={17} height={12} rx={2.5} stroke={color} strokeWidth={1.6} />
      <Path d="M3.5 10H20.5" stroke={color} strokeWidth={1.6} />
      <Path d="M7 15H10" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function PasswordLockIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={6} y={10} width={12} height={10} rx={2} stroke={color} strokeWidth={1.6} />
      <Path
        d="M8.5 10V8.2C8.5 6.3 10 4.8 12 4.8C14 4.8 15.5 6.3 15.5 8.2V10"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Circle cx={12} cy={15} r={1.2} fill={color} />
    </Svg>
  );
}

export function FingerprintIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4.5C8.4 4.5 5.5 7.4 5.5 11.1V13.2"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Path
        d="M8 12.2C8 9.9 9.8 8.1 12 8.1C14.2 8.1 16 9.9 16 12.2V14"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Path
        d="M12 10.4V16.8"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Path
        d="M9.4 14.2C9.8 16.4 10.6 18 12 19.2"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Path
        d="M14.8 14.6C14.4 16.2 13.6 17.6 12.6 18.6"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function TwoFactorKeyIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={8.5} cy={12} r={3.25} stroke={color} strokeWidth={1.6} />
      <Path
        d="M11.5 12H19.5M16.5 12V15.5M19 12V14"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TradingClassesIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 17V11" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M12 17V7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M17 17V13" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function LuckySixIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.25} stroke={color} strokeWidth={1.6} />
      <Path
        d="M13.6 9.4C13.2 8.8 12.5 8.4 11.7 8.4C10.2 8.4 9.1 9.6 9.1 11.3C9.1 13.1 10.3 14.4 12 14.4C13.2 14.4 14.2 13.7 14.5 12.7H12.8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function DocumentIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 4.5H13L17.5 9V19.5C17.5 20.1 17 20.5 16.5 20.5H7.5C6.9 20.5 6.5 20.1 6.5 19.5V5.5C6.5 4.9 6.9 4.5 7 4.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path d="M13 4.5V9H17.5" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M9 13H15M9 16.5H13.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function PrivacyShieldIcon({ color = '#1C1917', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5L19 6.5V11.5C19 15.8 16.2 19.4 12 20.5C7.8 19.4 5 15.8 5 11.5V6.5L12 3.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function UpgradeArrowGraphic({ size = 72 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <Path
        d="M36 58V22M36 22L22 36M36 22L50 36"
        stroke="#F5C518"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 52H54"
        stroke="#F5C518"
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.35}
      />
    </Svg>
  );
}

export function MenuChevronIcon({ color = '#A8A29E', size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6 3.5L10.5 8L6 12.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

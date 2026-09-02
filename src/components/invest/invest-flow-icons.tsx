import { Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = {
  color?: string;
  size?: number;
};

export function RiskChartIcon({
  size = 44,
  active = false,
}: {
  size?: number;
  active?: boolean;
}) {
  const bg = active ? '#57534E' : '#E7E5E4';
  const stroke = active ? '#FFFFFF' : '#A8A29E';

  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Circle cx={22} cy={22} r={22} fill={bg} />
      <Path
        d="M13 27L18 22L22 25L31 16"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M26 16H31V21"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PercentBadgeIcon({ size = 22 }: { size?: number }) {
  return (
    <View
      className="items-center justify-center rounded-full bg-brand"
      style={{ width: size, height: size }}>
      <Text className="font-geist-bold text-[11px] text-stone-title">%</Text>
    </View>
  );
}

export function ChevronRightSmallIcon({ color = '#1C1917', size = 14 }: IconProps) {
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

export function BankCoinsIcon({ color = '#C4A015', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 6C15.3137 6 18 5.32843 18 4.5C18 3.67157 15.3137 3 12 3C8.68629 3 6 3.67157 6 4.5C6 5.32843 8.68629 6 12 6Z"
        stroke={color}
        strokeWidth={1.6}
      />
      <Path
        d="M18 4.5V8.5C18 9.32843 15.3137 10 12 10C8.68629 10 6 9.32843 6 8.5V4.5"
        stroke={color}
        strokeWidth={1.6}
      />
      <Path
        d="M18 8.5V12.5C18 13.3284 15.3137 14 12 14C8.68629 14 6 13.3284 6 12.5V8.5"
        stroke={color}
        strokeWidth={1.6}
      />
      <Path
        d="M18 12.5V16.5C18 17.3284 15.3137 18 12 18C8.68629 18 6 17.3284 6 16.5V12.5"
        stroke={color}
        strokeWidth={1.6}
      />
      <Path
        d="M18 16.5V19.5C18 20.3284 15.3137 21 12 21C8.68629 21 6 20.3284 6 19.5V16.5"
        stroke={color}
        strokeWidth={1.6}
      />
    </Svg>
  );
}

export function WalletIcon({ color = '#57534E', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.5 8.5H16.5C17.6046 8.5 18.5 9.39543 18.5 10.5V18C18.5 19.1046 17.6046 20 16.5 20H5.5C4.39543 20 3.5 19.1046 3.5 18V8.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M3.5 8.5L5.8 4.8C6.1 4.3 6.7 4 7.3 4H18C19.1 4 20 4.9 20 6V8"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 12.5H21V16H18.5C17.6716 16 17 15.3284 17 14.5C17 13.6716 17.6716 12.5 18.5 12.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function RadioCheckIcon({ selected, size = 24 }: { selected: boolean; size?: number }) {
  if (!selected) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={10} stroke="#D1D5DB" strokeWidth={1.6} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill="#F5C518" />
      <Path
        d="M8 12.2L10.6 14.8L16.2 9.2"
        stroke="#FFFFFF"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function InfoCircleIcon({ color = '#9CA3AF', size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.6} />
      <Path d="M12 11V16" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Circle cx={12} cy={8} r={1} fill={color} />
    </Svg>
  );
}

export function CopyIcon({ color = '#9CA3AF', size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 9H7.5C6.11929 9 5 10.1193 5 11.5V17.5C5 18.8807 6.11929 20 7.5 20H13.5C14.8807 20 16 18.8807 16 17.5V16"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Path
        d="M9 7.5C9 6.11929 10.1193 5 11.5 5H16.5C17.8807 5 19 6.11929 19 7.5V12.5C19 13.8807 17.8807 15 16.5 15H11.5C10.1193 15 9 13.8807 9 12.5V7.5Z"
        stroke={color}
        strokeWidth={1.6}
      />
    </Svg>
  );
}

export function UploadIcon({ color = '#C4A015', size = 28 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15V4M12 4L8 8M12 4L16 8"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 15V17C4 18.6569 5.34315 20 7 20H17C18.6569 20 20 18.6569 20 17V15"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function BankTransferIcon({ color = '#C4A015', size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 10H20" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M6 10V18" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M10 10V18" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M14 10V18" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M18 10V18" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M3 18H21" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path
        d="M12 4L20 9H4L12 4Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BitcoinIcon({ color = '#F7931A', size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.6} />
      <Path
        d="M10 7.5H13.2C14.4 7.5 15.3 8.3 15.3 9.4C15.3 10.2 14.8 10.8 14.1 11C14.9 11.2 15.5 11.9 15.5 12.8C15.5 14 14.5 14.9 13.2 14.9H10V7.5Z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <Path d="M11.2 7.5V6M13.2 7.5V6M11.2 16V14.9M13.2 16V14.9" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

export function EthereumIcon({ color = '#627EEA', size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3L18 12L12 15L6 12L12 3Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M12 15L18 12L12 21L6 12L12 15Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}

export function WhatsAppIcon({ color = '#128C7E', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5C7.85786 3.5 4.5 6.85786 4.5 11C4.5 12.45 4.92 13.8 5.65 14.95L4.5 20.5L10.2 19.35C11.25 19.95 12.5 20.5 12 20.5C16.1421 20.5 19.5 17.1421 19.5 13C19.5 8.85786 16.1421 3.5 12 3.5Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M9.2 9.8C9.4 9.4 9.7 9.4 9.9 9.8L10.5 11C10.6 11.2 10.55 11.4 10.4 11.55L10.1 11.85C10.4 12.4 11 13 11.7 13.5L12.1 13.2C12.25 13.05 12.45 13 12.65 13.1L13.9 13.6C14.3 13.75 14.35 14.05 14 14.25C13.4 14.6 12.5 14.7 11.5 13.7C10.3 12.5 9.7 11.2 9.2 9.8Z"
        fill={color}
      />
    </Svg>
  );
}

export function SuccessCheckBadge({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <Path
        d="M48 8L55.2 12.4L63.8 11.2L68.8 18.2L77.2 20.8L79.2 29.4L85.6 35.2L83.6 43.8L85.6 52.4L79.2 58.2L77.2 66.8L68.8 69.4L63.8 76.4L55.2 75.2L48 79.6L40.8 75.2L32.2 76.4L27.2 69.4L18.8 66.8L16.8 58.2L10.4 52.4L12.4 43.8L10.4 35.2L16.8 29.4L18.8 20.8L27.2 18.2L32.2 11.2L40.8 12.4L48 8Z"
        fill="#DCFCE7"
      />
      <Circle cx={48} cy={48} r={22} fill="#16A34A" />
      <Path
        d="M38 48.5L44.5 55L58 41"
        stroke="#FFFFFF"
        strokeWidth={3.5}
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

export function StatusCheckIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill="#16A34A" />
      <Path
        d="M8 12.2L10.6 14.8L16.2 9.2"
        stroke="#FFFFFF"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function NotificationBellSmallIcon({ color = '#C4A015', size = 16 }: IconProps) {
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

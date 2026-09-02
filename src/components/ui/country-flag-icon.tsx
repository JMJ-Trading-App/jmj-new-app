import { useId } from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

export type CountryFlagCode = 'ng';

type CountryFlagIconProps = {
  code?: CountryFlagCode;
  size?: number;
};

function NigeriaFlagIcon({ size }: { size: number }) {
  const clipId = useId().replace(/:/g, '');

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <ClipPath id={clipId}>
          <Rect width={24} height={24} rx={12} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${clipId})`}>
        <Path fillRule="evenodd" clipRule="evenodd" d="M0 0H24V24H0V0Z" fill="#FFFFFF" />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.9984 0H24V24H15.9984V0ZM0 0H8.00156V24H0V0Z"
          fill="#008753"
        />
      </G>
    </Svg>
  );
}

export function CountryFlagIcon({ code = 'ng', size = 24 }: CountryFlagIconProps) {
  switch (code) {
    case 'ng':
    default:
      return <NigeriaFlagIcon size={size} />;
  }
}

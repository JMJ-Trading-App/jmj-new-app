import { Pressable, Text, View } from 'react-native';

import { BellIcon, SignalsIcon } from '@/components/home/home-icons';
import { HelpIcon } from '@/components/invest/invest-icons';
import { WhatsAppIcon } from '@/components/invest/invest-flow-icons';
import {
  DocumentIcon,
  FingerprintIcon,
  KycShieldIcon,
  LuckySixIcon,
  MenuChevronIcon,
  OccupationIcon,
  PasswordLockIcon,
  PayoutCardIcon,
  PrivacyShieldIcon,
  ProfileIcon,
  TradingClassesIcon,
  TwoFactorKeyIcon,
} from '@/components/more/more-icons';
import type { MoreBadgeVariant, MoreIconId, MoreMenuItem, MoreMenuSection } from '@/constants/more-data';
import { cn } from '@/lib/cn';

const BADGE_STYLES: Record<MoreBadgeVariant, { container: string; text: string }> = {
  pending: {
    container: 'bg-[#F5E8B0]',
    text: 'text-[#8A6D10]',
  },
  comingSoon: {
    container: 'bg-[#DCFCE7]',
    text: 'text-[#166534]',
  },
  verified: {
    container: 'bg-[#DCFCE7]',
    text: 'text-[#166534]',
  },
  status: {
    container: 'bg-transparent px-0',
    text: 'text-muted',
  },
};

function MenuIcon({ id }: { id: MoreIconId }) {
  switch (id) {
    case 'profile':
      return <ProfileIcon />;
    case 'kyc':
      return <KycShieldIcon />;
    case 'notifications':
      return <BellIcon />;
    case 'occupation':
      return <OccupationIcon />;
    case 'payout':
      return <PayoutCardIcon />;
    case 'password':
      return <PasswordLockIcon />;
    case 'biometrics':
      return <FingerprintIcon />;
    case 'twoFactor':
      return <TwoFactorKeyIcon />;
    case 'tradingClasses':
      return <TradingClassesIcon />;
    case 'signals':
      return <SignalsIcon color="#1C1917" />;
    case 'lucky6':
      return <LuckySixIcon />;
    case 'help':
      return <HelpIcon />;
    case 'whatsapp':
      return <WhatsAppIcon color="#25D366" size={22} />;
    case 'terms':
      return <DocumentIcon />;
    case 'privacy':
      return <PrivacyShieldIcon />;
    default:
      return null;
  }
}

type MoreMenuSectionCardProps = {
  section: MoreMenuSection;
  onItemPress?: (item: MoreMenuItem) => void;
};

export function MoreMenuSectionCard({ section, onItemPress }: MoreMenuSectionCardProps) {
  return (
    <View className="gap-2">
      <Text className="px-1 font-geist-semibold text-[11px] tracking-[0.08em] text-muted">
        {section.title}
      </Text>

      <View
        className="overflow-hidden rounded-[20px] border border-[#EFEFEF] bg-white"
        style={{
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.03,
          shadowRadius: 24,
          elevation: 2,
        }}>
        {section.items.map((item, index) => {
          const isLast = index === section.items.length - 1;
          const badgeStyle = item.badge ? BADGE_STYLES[item.badge.variant] : null;

          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => onItemPress?.(item)}
              className={cn(
                'flex-row items-center gap-3 px-4 py-3.5',
                !isLast && 'border-b border-[#F3F4F6]',
              )}
              style={({ pressed }) => [pressed && { opacity: 0.88 }]}>
              <View className="h-9 w-9 items-center justify-center">
                <MenuIcon id={item.icon} />
              </View>

              <Text className="min-w-0 flex-1 font-geist-medium text-[15px] text-stone-title">
                {item.label}
              </Text>

              {item.badge && badgeStyle ? (
                <View className={cn('rounded-full px-2.5 py-1', badgeStyle.container)}>
                  <Text className={cn('font-geist-medium text-[12px]', badgeStyle.text)}>
                    {item.badge.label}
                  </Text>
                </View>
              ) : null}

              <MenuChevronIcon />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WhatsAppIcon } from '@/components/invest/invest-flow-icons';
import {
  HelpCallIcon,
  HelpEmailIcon,
  HelpFaqIcon,
  HelpIconBadge,
  HelpInstagramIcon,
  HelpXIcon,
} from '@/components/more/help-center-icons';
import { MenuChevronIcon } from '@/components/more/more-icons';
import type { HelpCenterItem } from '@/constants/help-center-data';
import { useSupportSettings } from '@/hooks/use-support-settings';
import { helpCenterItemsFromSettings } from '@/lib/support';

function ItemIcon({ item }: { item: HelpCenterItem }) {
  switch (item.icon) {
    case 'call':
      return <HelpCallIcon />;
    case 'email':
      return <HelpEmailIcon />;
    case 'faq':
      return <HelpFaqIcon />;
    case 'instagram':
      return <HelpInstagramIcon />;
    case 'x':
      return <HelpXIcon />;
    case 'whatsapp':
      return <WhatsAppIcon color="#1C1917" size={22} />;
    default:
      return null;
  }
}

function openItem(item: HelpCenterItem) {
  if (item.action === 'tel' && item.value) {
    void Linking.openURL(`tel:${item.value}`);
    return;
  }

  if (item.action === 'mailto' && item.value) {
    void Linking.openURL(`mailto:${item.value}`);
    return;
  }

  if (item.action === 'url' && item.value) {
    void Linking.openURL(item.value);
  }
}

export default function HelpCenterScreen() {
  const insets = useSafeAreaInsets();
  const { settings } = useSupportSettings();
  const items = helpCenterItemsFromSettings(settings);

  return (
    <View className="flex-1 bg-[#F7F7F5]">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-4 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            Help Center
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 px-5 pb-8"
        showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={() => openItem(item)}
            className="flex-row items-center gap-3 rounded-[16px] border border-[#EFEFEF] bg-white px-4 py-3.5"
            style={({ pressed }) => [
              {
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.04,
                shadowRadius: 16,
                elevation: 2,
              },
              pressed && { opacity: 0.92 },
            ]}>
            <HelpIconBadge>
              <ItemIcon item={item} />
            </HelpIconBadge>
            <Text className="min-w-0 flex-1 font-geist-medium text-[15px] text-stone-title">
              {item.label}
            </Text>
            <MenuChevronIcon />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

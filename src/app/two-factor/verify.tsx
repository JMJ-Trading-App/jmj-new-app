import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';

export default function TwoFactorVerifyScreen() {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const canVerify = useMemo(() => code.length === 6, [code]);

  async function handleVerify() {
    if (!canVerify || loading) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    router.push('/two-factor/success' as Href);
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-2 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            Verify Code
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <View className="flex-1 gap-8 px-5 pt-8">
          <Text className="text-center font-geist text-[15px] leading-[22px] text-muted">
            Enter the 6-digit code from your SMS to complete the 2 factor authentication setup
          </Text>

          <OtpInput accentFilled value={code} onChange={setCode} />
        </View>

        <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          <Button disabled={!canVerify} label="Verify" loading={loading} onPress={handleVerify} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

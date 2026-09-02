import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { Screen } from '@/components/ui/screen';
import { resendEmailCode, verifyEmailCode } from '@/lib/mock-auth';
import { formatCountdown, useCountdown } from '@/hooks/use-countdown';

const RESEND_SECONDS = 50;

export default function VerifyEmailScreen() {
  const { email = 'example@email.com' } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { secondsLeft, reset } = useCountdown(RESEND_SECONDS);

  const canContinue = useMemo(() => code.length === 6, [code]);
  const canResend = secondsLeft === 0 && !resending;

  async function handleContinue() {
    if (!canContinue || loading) {
      return;
    }

    setLoading(true);
    await verifyEmailCode(String(email), code);
    setLoading(false);
    router.push('/auth/identity');
  }

  async function handleResend() {
    if (!canResend) {
      return;
    }

    setResending(true);
    await resendEmailCode(String(email));
    setResending(false);
    setCode('');
    reset(RESEND_SECONDS);
  }

  return (
    <Screen
      keyboardAvoiding
      showHelpButton
      onBack={() => router.back()}
      onHelp={() => {
        // Help flow will be connected later.
      }}
      footer={
        <Button disabled={!canContinue} label="Continue" loading={loading} onPress={handleContinue} />
      }>
      <View className="flex-1 gap-8 pt-2">
        <View className="gap-2">
          <ThemedText type="heading" className="text-left">
            Verify your email
          </ThemedText>
          <ThemedText type="body" themeColor="textMuted" className="text-left">
            We sent a 6-digit code to {email}
          </ThemedText>
        </View>

        <OtpInput value={code} onChange={setCode} />

        <View className="items-start">
          {canResend ? (
            <Pressable accessibilityRole="button" onPress={handleResend}>
              <ThemedText type="body" themeColor="text">
                Resend code
              </ThemedText>
            </Pressable>
          ) : (
            <ThemedText type="body" themeColor="textMuted">
              Resend in{' '}
              <ThemedText type="body" themeColor="text" className="font-geist-semibold">
                {formatCountdown(secondsLeft)}
              </ThemedText>
            </ThemedText>
          )}
        </View>
      </View>
    </Screen>
  );
}

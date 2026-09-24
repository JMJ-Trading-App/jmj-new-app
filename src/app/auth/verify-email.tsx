import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { Screen } from '@/components/ui/screen';
import { resendEmailCode, verifyEmailCode } from '@/lib/auth';
import { alertError, alertSuccess } from '@/lib/errors';
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
    try {
      await verifyEmailCode(String(email), code);
      alertSuccess('Your email has been verified.', 'Verified');
      router.push('/auth/identity');
    } catch (error) {
      alertError(error, 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!canResend) {
      return;
    }

    setResending(true);
    try {
      await resendEmailCode(String(email));
      setCode('');
      reset(RESEND_SECONDS);
      alertSuccess('A new code has been sent to your email.', 'Code resent');
    } catch (error) {
      alertError(error, 'Could not resend code');
    } finally {
      setResending(false);
    }
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
            We sent a 6-digit code to {email}. It expires in 5 minutes.
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

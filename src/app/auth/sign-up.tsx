import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { PasswordRequirements } from '@/components/auth/password-requirements';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { PhoneField } from '@/components/ui/phone-field';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { checkEmailAvailability, submitSignUp } from '@/lib/auth';
import { alertError, alertSuccess } from '@/lib/errors';
import {
  getPasswordChecks,
  isPasswordValid,
} from '@/lib/password-validation';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const passwordChecks = useMemo(
    () => getPasswordChecks(password, confirmPassword),
    [confirmPassword, password],
  );

  const canContinue = useMemo(
    () =>
      email.trim().length > 0 &&
      phone.replace(/\s/g, '').length >= 10 &&
      isPasswordValid(passwordChecks) &&
      !emailError,
    [email, emailError, passwordChecks, phone],
  );

  const showRequirements = password.length > 0 || confirmPassword.length > 0;

  function handleEmailChange(value: string) {
    setEmail(value);

    if (emailError) {
      setEmailError(undefined);
    }
  }

  async function handleContinue() {
    if (!canContinue || loading) {
      return;
    }

    setLoading(true);
    setEmailError(undefined);

    try {
      const emailCheck = await checkEmailAvailability(email);

      if (!emailCheck.available) {
        setEmailError(emailCheck.message ?? 'Email address is already registered.');
        return;
      }

      await submitSignUp({ email, phone, password });
      alertSuccess('Check your email for a verification code.', 'Account created');
      router.push({ pathname: '/auth/verify-email', params: { email } });
    } catch (error) {
      alertError(error, 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen
      showHelpButton
      onBack={() => router.back()}
      onHelp={() => {
        // Help flow will be connected later.
      }}
      footer={
        <View className="gap-3">
          <Button
            disabled={!canContinue}
            label="Continue"
            loading={loading}
            onPress={handleContinue}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/auth/sign-in')}>
            <ThemedText className="text-center font-geist-medium text-[14px] text-stone-body">
              Already have an account?{' '}
              <ThemedText className="font-geist-semibold text-stone-title">
                Sign in
              </ThemedText>
            </ThemedText>
          </Pressable>
        </View>
      }>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow gap-4 pt-2 pb-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ThemedText type="heading" className="text-left">
            Create Your Account
          </ThemedText>

          <View className="gap-4">
            <TextField
              autoCapitalize="none"
              autoComplete="email"
              borderState={email && !emailError ? 'filled' : 'default'}
              clearable
              errorMessage={emailError}
              keyboardType="email-address"
              label="Email"
              placeholder="example@email.com"
              textContentType="emailAddress"
              value={email}
              onChangeText={handleEmailChange}
              onClear={() => {
                setEmail('');
                setEmailError(undefined);
              }}
            />

            <PhoneField
              borderState={phone ? 'filled' : 'default'}
              value={phone}
              onChangeText={setPhone}
            />

            <TextField
              autoComplete="new-password"
              borderState={password ? 'success' : 'default'}
              label="Password"
              secureTextEntry
              secureToggle
              textContentType="newPassword"
              value={password}
              onChangeText={setPassword}
            />

            <TextField
              autoComplete="new-password"
              borderState={confirmPassword ? 'success' : 'default'}
              label="Confirm Password"
              secureTextEntry
              secureToggle
              textContentType="newPassword"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {showRequirements ? <PasswordRequirements checks={passwordChecks} /> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { PasswordRequirements } from '@/components/auth/password-requirements';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { PhoneField } from '@/components/ui/phone-field';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { checkEmailAvailability, submitSignUp } from '@/lib/mock-auth';
import {
  getPasswordChecks,
  isPasswordValid,
} from '@/lib/password-validation';
import { Spacing } from '@/constants/theme';

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

    const emailCheck = await checkEmailAvailability(email);

    if (!emailCheck.available) {
      setEmailError(emailCheck.message ?? 'Email address is already registered.');
      setLoading(false);
      return;
    }

    await submitSignUp({ email, phone, password });

    setLoading(false);
    router.push({ pathname: '/auth/verify-email', params: { email } });
  }

  return (
    <Screen
      showHelpButton
      onBack={() => router.back()}
      onHelp={() => {
        // Help flow will be connected later.
      }}
      footer={<Button disabled={!canContinue} label="Continue" loading={loading} onPress={handleContinue} />}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ThemedText type="heading" style={styles.title}>
            Create Your Account
          </ThemedText>

          <View style={styles.form}>
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'left',
  },
  form: {
    gap: Spacing.three,
  },
});

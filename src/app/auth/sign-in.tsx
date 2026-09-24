import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { login } from '@/lib/auth';
import { alertError, alertSuccess } from '@/lib/errors';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const canContinue = useMemo(
    () => email.trim().length > 0 && password.length >= 8,
    [email, password],
  );

  async function handleSignIn() {
    if (!canContinue || loading) return;

    setLoading(true);
    try {
      await login({ email, password });
      alertSuccess('Welcome back.', 'Signed in');
      router.replace('/(tabs)/home');
    } catch (error) {
      alertError(error, 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen
      onBack={() => router.back()}
      footer={
        <View className="gap-3">
          <Button
            disabled={!canContinue}
            label="Sign in"
            loading={loading}
            onPress={handleSignIn}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/auth/sign-up')}>
            <ThemedText className="text-center font-geist-medium text-[14px] text-stone-body">
              New here?{' '}
              <ThemedText className="font-geist-semibold text-stone-title">
                Create an account
              </ThemedText>
            </ThemedText>
          </Pressable>
        </View>
      }>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow gap-6 pt-2 pb-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="gap-2">
            <ThemedText type="heading" className="text-left">
              Welcome back
            </ThemedText>
            <ThemedText type="body" themeColor="textMuted" className="text-left">
              Sign in with the email and password you used to register.
            </ThemedText>
          </View>

          <View className="gap-4">
            <TextField
              autoCapitalize="none"
              autoComplete="email"
              borderState={email ? 'filled' : 'default'}
              keyboardType="email-address"
              label="Email"
              placeholder="example@email.com"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
            />

            <TextField
              autoComplete="password"
              borderState={password ? 'filled' : 'default'}
              label="Password"
              secureTextEntry
              secureToggle
              textContentType="password"
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

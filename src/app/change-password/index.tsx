import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PasswordRequirements } from '@/components/auth/password-requirements';
import { ChangePasswordHero } from '@/components/more/change-password-hero';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { getPasswordChecks, isPasswordValid } from '@/lib/password-validation';

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordChecks = useMemo(
    () => getPasswordChecks(newPassword, confirmPassword),
    [confirmPassword, newPassword],
  );

  const canUpdate =
    currentPassword.trim().length > 0 &&
    isPasswordValid(passwordChecks) &&
    currentPassword !== newPassword;

  async function handleUpdate() {
    if (!canUpdate || loading) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    router.push('/change-password/success' as Href);
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
            Change Password
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-6 px-5 pb-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="items-center gap-4 pt-2">
            <ChangePasswordHero />
            <Text className="text-center font-geist text-[15px] leading-[22px] text-muted">
              Enter your current password and choose a new one
            </Text>
          </View>

          <View className="gap-4">
            <TextField
              autoComplete="password"
              borderState={currentPassword ? 'filled' : 'default'}
              label="Current Password"
              secureTextEntry
              secureToggle
              textContentType="password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TextField
              autoComplete="new-password"
              borderState={newPassword ? 'filled' : 'default'}
              label="New Password"
              secureTextEntry
              secureToggle
              textContentType="newPassword"
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextField
              autoComplete="new-password"
              borderState={confirmPassword ? 'filled' : 'default'}
              label="Confirm New Password"
              secureTextEntry
              secureToggle
              textContentType="newPassword"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <PasswordRequirements checks={passwordChecks} />
        </ScrollView>

        <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          <Button
            disabled={!canUpdate}
            label="Update Password"
            loading={loading}
            onPress={handleUpdate}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { DateOfBirthField } from '@/components/ui/date-of-birth-field';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { submitIdentity } from '@/lib/auth';
import { isCompleteDateOfBirth, toIsoDateString } from '@/lib/date-of-birth';
import { alertError, alertSuccess } from '@/lib/errors';

export default function IdentityScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);

  const canContinue = useMemo(
    () =>
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      isCompleteDateOfBirth(dateOfBirth),
    [dateOfBirth, firstName, lastName],
  );

  async function handleContinue() {
    if (!canContinue || loading) {
      return;
    }

    setLoading(true);
    try {
      await submitIdentity({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: toIsoDateString(dateOfBirth),
      });
      alertSuccess('Identity saved.', 'Saved');
      router.push('/auth/preferences');
    } catch (error) {
      alertError(error, 'Could not save identity');
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
        <Button
          disabled={!canContinue}
          label="Continue"
          loading={loading}
          onPress={handleContinue}
        />
      }>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow gap-8 pt-2 pb-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ThemedText type="heading" className="text-left">
            Your Identity
          </ThemedText>

          <View className="gap-4">
            <View className="flex-row gap-2">
              <View className="flex-1">
                <TextField
                  autoComplete="given-name"
                  borderState={firstName ? 'filled' : 'default'}
                  label="First Name"
                  textContentType="givenName"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

              <View className="flex-1">
                <TextField
                  autoComplete="family-name"
                  borderState={lastName ? 'filled' : 'default'}
                  label="Last Name"
                  textContentType="familyName"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <DateOfBirthField
              borderState={dateOfBirth ? 'success' : 'default'}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />
            <ThemedText type="body" themeColor="textMuted">
              You must be 18 or older to use JMJ
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

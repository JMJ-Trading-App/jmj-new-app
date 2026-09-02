import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { formatDateOfBirth, isCompleteDateOfBirth } from '@/lib/date-of-birth';
import { submitIdentity } from '@/lib/mock-auth';
import { Spacing } from '@/constants/theme';

export default function IdentityScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const canContinue = useMemo(
    () =>
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      isCompleteDateOfBirth(dateOfBirth) &&
      confirmPassword.length > 0,
    [confirmPassword, dateOfBirth, firstName, lastName],
  );

  async function handleContinue() {
    if (!canContinue || loading) {
      return;
    }

    setLoading(true);
    await submitIdentity({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth,
      confirmPassword,
    });
    setLoading(false);
    router.push('/auth/preferences');
  }

  return (
    <Screen
      showHelpButton
      onBack={() => router.back()}
      onHelp={() => {
        // Help flow will be connected later.
      }}
      footer={
        <Button disabled={!canContinue} label="Continue" loading={loading} onPress={handleContinue} />
      }>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ThemedText type="heading" style={styles.title}>
            Your Identity
          </ThemedText>

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <TextField
                  autoComplete="given-name"
                  borderState={firstName ? 'filled' : 'default'}
                  label="First Name"
                  textContentType="givenName"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

              <View style={styles.nameField}>
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

            <TextField
              borderState={dateOfBirth ? 'success' : 'default'}
              keyboardType="number-pad"
              label="Date of Birth"
              secureTextEntry
              secureToggle
              textContentType="none"
              value={dateOfBirth}
              onChangeText={(value) => setDateOfBirth(formatDateOfBirth(value))}
            />

            <TextField
              autoComplete="password"
              borderState={confirmPassword ? 'success' : 'default'}
              label="Confirm Password"
              secureTextEntry
              secureToggle
              textContentType="password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
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
    gap: Spacing.five,
  },
  title: {
    textAlign: 'left',
  },
  form: {
    gap: Spacing.three,
  },
  nameRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  nameField: {
    flex: 1,
  },
});

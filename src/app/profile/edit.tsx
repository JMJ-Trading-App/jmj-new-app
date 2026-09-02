import { router } from 'expo-router';
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

import { RankBadgeIcon } from '@/components/home/home-icons';
import { Button } from '@/components/ui/button';
import { DateOfBirthField } from '@/components/ui/date-of-birth-field';
import { PhoneField } from '@/components/ui/phone-field';
import { TextField } from '@/components/ui/text-field';
import { PROFILE } from '@/constants/profile-data';
import { isCompleteDateOfBirth } from '@/lib/date-of-birth';
import { getSignupFirstName, getSignupInitials, getSignupLastName } from '@/lib/mock-auth';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState(
    getSignupFirstName() || PROFILE.fullName.split(' ')[0],
  );
  const [lastName, setLastName] = useState(
    getSignupLastName() || PROFILE.fullName.split(' ').slice(1).join(' '),
  );
  const [email, setEmail] = useState(PROFILE.email);
  const [phone, setPhone] = useState('801 234 5678');
  const [dateOfBirth, setDateOfBirth] = useState('15/01/1995');
  const [country, setCountry] = useState('Nigeria');
  const [saving, setSaving] = useState(false);

  const initials = getSignupInitials() || PROFILE.initials;

  const canSave = useMemo(
    () =>
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      email.trim().length > 0 &&
      phone.replace(/\s/g, '').length >= 7 &&
      isCompleteDateOfBirth(dateOfBirth) &&
      country.trim().length > 0,
    [country, dateOfBirth, email, firstName, lastName, phone],
  );

  async function handleSave() {
    if (!canSave || saving) return;

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
    router.back();
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
            Edit Profile
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
          <View className="items-center gap-3 pt-2">
            <View className="relative">
              <View className="h-24 w-24 items-center justify-center rounded-full bg-stone-title">
                <Text className="font-geist-bold text-[28px] text-[#F5E8B0]">{initials}</Text>
              </View>
              <View className="absolute -right-0.5 -top-0.5 h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#E7E5E4]">
                <RankBadgeIcon size={14} tier={PROFILE.planTier} />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Change photo"
                onPress={() => {}}
                className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full bg-[#F5E8B0]"
                style={({ pressed }) => [pressed && { opacity: 0.88 }]}>
                <SymbolView name="camera.fill" size={14} tintColor="#1C1917" />
              </Pressable>
            </View>

            <Text className="font-geist text-[13px] text-muted">Update your personal details</Text>
          </View>

          <View className="gap-4">
            <View className="flex-row gap-2">
              <View className="flex-1">
                <TextField
                  autoComplete="given-name"
                  borderState={firstName ? 'filled' : 'default'}
                  label="First Name"
                  onChangeText={setFirstName}
                  textContentType="givenName"
                  value={firstName}
                />
              </View>
              <View className="flex-1">
                <TextField
                  autoComplete="family-name"
                  borderState={lastName ? 'filled' : 'default'}
                  label="Last Name"
                  onChangeText={setLastName}
                  textContentType="familyName"
                  value={lastName}
                />
              </View>
            </View>

            <TextField
              autoCapitalize="none"
              autoComplete="email"
              borderState={email ? 'filled' : 'default'}
              keyboardType="email-address"
              label="Email Address"
              onChangeText={setEmail}
              textContentType="emailAddress"
              value={email}
            />

            <PhoneField
              borderState={phone ? 'filled' : 'default'}
              label="Phone Number"
              onChangeText={setPhone}
              value={phone}
            />

            <DateOfBirthField
              borderState={dateOfBirth ? 'filled' : 'default'}
              onChangeText={setDateOfBirth}
              value={dateOfBirth}
            />

            <TextField
              borderState={country ? 'filled' : 'default'}
              label="Country"
              onChangeText={setCountry}
              value={country}
            />
          </View>
        </ScrollView>

        <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          <Button disabled={!canSave} label="Save Changes" loading={saving} onPress={handleSave} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

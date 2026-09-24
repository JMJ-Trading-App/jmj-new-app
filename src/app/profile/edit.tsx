import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RankBadgeIcon, type RankTier } from '@/components/home/home-icons';
import { Button } from '@/components/ui/button';
import { DateOfBirthField } from '@/components/ui/date-of-birth-field';
import { PhoneField } from '@/components/ui/phone-field';
import { TextField } from '@/components/ui/text-field';
import { useSession } from '@/hooks/use-session';
import {
  formatDobInputFromIso,
  isCompleteDateOfBirth,
  toIsoDateString,
} from '@/lib/date-of-birth';
import { alertError, alertSuccess } from '@/lib/errors';
import { fetchProfile, updateProfile } from '@/lib/users';

function asRankTier(tier?: string | null): RankTier {
  if (tier === 'pro' || tier === 'vip' || tier === 'basic') return tier;
  return 'basic';
}

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(
    formatDobInputFromIso(user?.dateOfBirth),
  );
  const [country, setCountry] = useState(user?.country ?? 'Nigeria');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const profile = await fetchProfile();
        setFirstName(profile.firstName ?? '');
        setLastName(profile.lastName ?? '');
        setEmail(profile.email ?? '');
        setPhone(profile.phone ?? '');
        setDateOfBirth(formatDobInputFromIso(profile.dateOfBirth));
        setCountry(profile.country ?? 'Nigeria');
      } catch (error) {
        alertError(error, 'Could not load profile');
      }
    })();
  }, []);

  const initials = user?.initials || 'JM';
  const planTier = asRankTier(user?.planTier);

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
    try {
      await updateProfile({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: toIsoDateString(dateOfBirth),
        country,
      });
      alertSuccess('Your profile has been updated.', 'Saved');
      router.back();
    } catch (error) {
      alertError(error, 'Could not save profile');
    } finally {
      setSaving(false);
    }
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
                <RankBadgeIcon size={14} tier={planTier} />
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

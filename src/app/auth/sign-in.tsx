import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';

export default function SignInScreen() {
  return (
    <Screen
      onBack={() => router.back()}
      footer={<Button label="Sign in" onPress={() => router.replace('/(tabs)/home')} />}>
      <View style={styles.content}>
        <ThemedText type="heading" style={styles.title}>
          Welcome back
        </ThemedText>
        <ThemedText type="body" themeColor="textMuted" style={styles.subtitle}>
          Sign-in form will go here. Backend connection coming later.
        </ThemedText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: Spacing.five,
    gap: Spacing.two,
  },
  title: {
    textAlign: 'left',
  },
  subtitle: {
    textAlign: 'left',
  },
});

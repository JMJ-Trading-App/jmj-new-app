import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PASSWORD_RULES, type PasswordChecks } from '@/lib/password-validation';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PasswordRequirementsProps = {
  checks: PasswordChecks;
};

export function PasswordRequirements({ checks }: PasswordRequirementsProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="body" themeColor="textMuted" style={styles.title}>
        Your password must contain:
      </ThemedText>

      <View style={styles.list}>
        {PASSWORD_RULES.map((rule) => {
          const passed = checks[rule.id];
          const color = passed ? theme.success : theme.error;

          return (
            <View key={rule.id} style={styles.item}>
              <SymbolView
                name={passed ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
                size={18}
                tintColor={color}
              />
              <ThemedText type="body" style={[styles.label, { color }]}>
                {rule.label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    gap: Spacing.two,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});

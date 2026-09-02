import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CheckmarkIcon } from '@/components/ui/checkmark-icon';
import { PASSWORD_RULES, type PasswordChecks } from '@/lib/password-validation';
import { cn } from '@/lib/cn';

type PasswordRequirementsProps = {
  checks: PasswordChecks;
  className?: string;
};

export function PasswordRequirements({ checks, className }: PasswordRequirementsProps) {
  return (
    <View className={cn('gap-2', className)}>
      <ThemedText type="body" themeColor="textMuted" className="text-[15px] leading-[22px]">
        Your password must contain:
      </ThemedText>

      <View className="gap-2">
        {PASSWORD_RULES.map((rule) => {
          const passed = checks[rule.id];

          return (
            <View key={rule.id} className="flex-row items-center gap-2">
              <CheckmarkIcon passed={passed} />
              <ThemedText
                type="body"
                className={cn(
                  'flex-1 text-[15px] leading-[22px]',
                  passed ? 'text-success' : 'text-error',
                )}>
                {rule.label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

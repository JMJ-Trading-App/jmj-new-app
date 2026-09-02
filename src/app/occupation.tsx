import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  OccupationFormCard,
  OccupationSelectRow,
} from '@/components/occupation/occupation-form-fields';
import { OccupationOptionSheet } from '@/components/occupation/occupation-option-sheet';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_OCCUPATION_VALUES,
  OCCUPATION_FIELDS,
  type OccupationFieldId,
  type OccupationOption,
} from '@/constants/occupation-data';

export default function OccupationScreen() {
  const insets = useSafeAreaInsets();
  const [values, setValues] = useState(DEFAULT_OCCUPATION_VALUES);
  const [activeField, setActiveField] = useState<OccupationFieldId | null>(null);
  const [loading, setLoading] = useState(false);

  const activeConfig = useMemo(
    () => OCCUPATION_FIELDS.find((field) => field.id === activeField) ?? null,
    [activeField],
  );

  function getLabel(fieldId: OccupationFieldId) {
    const field = OCCUPATION_FIELDS.find((item) => item.id === fieldId);
    return field?.options.find((option) => option.id === values[fieldId])?.label ?? 'Select...';
  }

  function handleSelect(option: OccupationOption) {
    if (!activeField) return;
    setValues((prev) => ({ ...prev, [activeField]: option.id }));
  }

  async function handleDone() {
    if (loading) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    router.back();
  }

  return (
    <>
      <View className="flex-1 bg-white">
        <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
          <View className="mb-6 flex-row items-center gap-3">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center">
              <SymbolView name="chevron.left" size={22} tintColor="#1C1917" weight="medium" />
            </Pressable>
            <Text className="flex-1 font-geist-bold text-[18px] text-stone-title">
              Occupation & Source of funds
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-6"
          showsVerticalScrollIndicator={false}>
          <OccupationFormCard>
            {OCCUPATION_FIELDS.map((field, index) => (
              <OccupationSelectRow
                key={field.id}
                label={field.label}
                value={getLabel(field.id)}
                onPress={() => setActiveField(field.id)}
                showDivider={index < OCCUPATION_FIELDS.length - 1}
              />
            ))}
          </OccupationFormCard>
        </ScrollView>

        <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          <Button label="Done" loading={loading} onPress={handleDone} />
        </View>
      </View>

      <OccupationOptionSheet
        visible={!!activeConfig}
        title={activeConfig?.label ?? ''}
        options={activeConfig?.options ?? []}
        selectedId={activeField ? values[activeField] : null}
        onClose={() => setActiveField(null)}
        onSelect={handleSelect}
      />
    </>
  );
}

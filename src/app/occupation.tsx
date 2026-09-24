import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  OccupationFormCard,
  OccupationSelectRow,
} from '@/components/occupation/occupation-form-fields';
import { OccupationOptionSheet } from '@/components/occupation/occupation-option-sheet';
import { Button } from '@/components/ui/button';
import {
  OCCUPATION_FIELDS,
  type OccupationFieldId,
  type OccupationOption,
} from '@/constants/occupation-data';
import { alertError, alertSuccess } from '@/lib/errors';
import {
  fetchOccupation,
  fetchOccupationOptions,
  saveOccupation,
} from '@/lib/occupation';

const EMPTY_VALUES: Record<OccupationFieldId, string> = {
  industry: '',
  occupation: '',
  sourceOfFunds: '',
  annualIncome: '',
};

export default function OccupationScreen() {
  const insets = useSafeAreaInsets();
  const [values, setValues] = useState(EMPTY_VALUES);
  const [fieldOptions, setFieldOptions] = useState(OCCUPATION_FIELDS);
  const [activeField, setActiveField] = useState<OccupationFieldId | null>(null);
  const [hydrating, setHydrating] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setHydrating(true);
      try {
        const [options, saved] = await Promise.all([
          fetchOccupationOptions(),
          fetchOccupation(),
        ]);
        if (cancelled) return;

        setFieldOptions([
          { id: 'industry', label: 'Industry', options: options.industry },
          { id: 'occupation', label: 'Occupation', options: options.occupation },
          {
            id: 'sourceOfFunds',
            label: 'Source of funds',
            options: options.sourceOfFunds,
          },
          {
            id: 'annualIncome',
            label: 'Annual income',
            options: options.annualIncome,
          },
        ]);
        setValues({
          industry: saved.industry ?? '',
          occupation: saved.occupation ?? '',
          sourceOfFunds: saved.sourceOfFunds ?? '',
          annualIncome: saved.annualIncome ?? '',
        });
      } catch (error) {
        if (!cancelled) alertError(error, 'Could not load occupation data');
      } finally {
        if (!cancelled) setHydrating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeConfig = useMemo(
    () => fieldOptions.find((field) => field.id === activeField) ?? null,
    [activeField, fieldOptions],
  );

  const canSave = Object.values(values).every((value) => value.trim().length > 0);

  function getLabel(fieldId: OccupationFieldId) {
    const selected = values[fieldId];
    if (!selected) return 'Select...';
    const field = fieldOptions.find((item) => item.id === fieldId);
    return field?.options.find((option) => option.id === selected)?.label ?? 'Select...';
  }

  function handleSelect(option: OccupationOption) {
    if (!activeField) return;
    setValues((prev) => ({ ...prev, [activeField]: option.id }));
  }

  async function handleDone() {
    if (loading || hydrating || !canSave) return;
    setLoading(true);
    try {
      await saveOccupation(values);
      alertSuccess('Occupation details saved.', 'Saved');
      router.back();
    } catch (error) {
      alertError(error, 'Could not save occupation');
    } finally {
      setLoading(false);
    }
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

        {hydrating ? (
          <View className="flex-1 items-center justify-center gap-3 pb-24">
            <ActivityIndicator color="#1C1917" />
            <Text className="font-geist text-[14px] text-muted">Loading your details…</Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-5 pb-6"
            showsVerticalScrollIndicator={false}>
            <OccupationFormCard>
              {fieldOptions.map((field, index) => (
                <OccupationSelectRow
                  key={field.id}
                  label={field.label}
                  value={getLabel(field.id)}
                  onPress={() => setActiveField(field.id)}
                  showDivider={index < fieldOptions.length - 1}
                />
              ))}
            </OccupationFormCard>
          </ScrollView>
        )}

        <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
          <Button
            label="Done"
            loading={loading}
            disabled={hydrating || !canSave}
            onPress={handleDone}
          />
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

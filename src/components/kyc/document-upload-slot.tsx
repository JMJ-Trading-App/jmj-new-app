import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { UploadIcon } from '@/components/invest/invest-flow-icons';

const MOCK_PREVIEW = require('../../../assets/images/welcome/welcome-1-hero.png');

export type DocumentUploadValue = {
  name: string;
  uri: number;
};

type DocumentUploadSlotProps = {
  label: string;
  value: DocumentUploadValue | null;
  onChange: (value: DocumentUploadValue | null) => void;
};

export function DocumentUploadSlot({ label, value, onChange }: DocumentUploadSlotProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startUpload() {
    if (uploading) return;

    setUploading(true);
    setProgress(0);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 12, 100);
        if (next >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setUploading(false);
          onChange({
            name: `${label.toLowerCase().replace(/\s+/g, '-')}.jpg`,
            uri: MOCK_PREVIEW,
          });
        }
        return next;
      });
    }, 80);
  }

  if (value && !uploading) {
    return (
      <View className="gap-3">
        <View className="overflow-hidden rounded-[16px] bg-[#F3F4F6]">
          <Image source={value.uri} style={{ width: '100%', height: 160 }} contentFit="cover" />
        </View>
        <View className="flex-row items-center justify-between px-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Re-upload ${label}`}
            onPress={startUpload}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
            <Text className="font-geist-semibold text-[14px] text-stone-title">Re-upload</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete ${label}`}
            onPress={() => onChange(null)}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
            <Text className="font-geist-semibold text-[14px] text-error">Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={uploading}
      onPress={startUpload}
      className="items-center justify-center gap-2 rounded-[16px] border border-dashed border-[#D1D5DB] px-4 py-8"
      style={({ pressed }) => [pressed && !uploading && { opacity: 0.9 }]}>
      <UploadIcon color="#C4A015" size={28} />
      <Text className="font-geist-semibold text-[15px] text-stone-title">{label}</Text>
      <Text className="font-geist text-[12px] text-muted">JPG, PNG or PDF, max 5MB</Text>

      {uploading ? (
        <View className="mt-3 w-full gap-1.5 px-2">
          <View className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
            <View className="h-full rounded-full bg-[#C4A015]" style={{ width: `${progress}%` }} />
          </View>
          <Text className="text-center font-geist text-[12px] text-muted">Uploading</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

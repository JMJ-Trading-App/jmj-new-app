import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { UploadIcon } from '@/components/invest/invest-flow-icons';
import type { KycDocumentSlot } from '@/lib/api/types';
import { alertError, alertSuccess } from '@/lib/errors';
import { clearKycDocument, setKycDocument } from '@/lib/kyc-draft';
import { uploadKycFile } from '@/lib/kyc';

export type DocumentUploadValue = {
  name: string;
  uri: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes?: number;
};

type DocumentUploadSlotProps = {
  label: string;
  slot: KycDocumentSlot;
  value: DocumentUploadValue | null;
  onChange: (value: DocumentUploadValue | null) => void;
};

function guessMime(uri: string, fallback = 'image/jpeg') {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.heic') || lower.endsWith('.heif')) return 'image/heic';
  return fallback;
}

export function DocumentUploadSlot({
  label,
  slot,
  value,
  onChange,
}: DocumentUploadSlotProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startProgress() {
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((current) => Math.min(current + 10, 90));
    }, 80);
  }

  function stopProgress() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setProgress(100);
  }

  async function startUpload() {
    if (uploading) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alertError(new Error('Photo library permission is required.'), 'Permission needed');
      return;
    }

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });

    if (picked.canceled || !picked.assets[0]) return;

    const asset = picked.assets[0];
    const name =
      asset.fileName ??
      `${label.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    const mimeType = asset.mimeType ?? guessMime(asset.uri);

    setUploading(true);
    startProgress();

    try {
      const uploaded = await uploadKycFile({
        uri: asset.uri,
        name,
        type: mimeType,
      });

      const next: DocumentUploadValue = {
        name: uploaded.fileName || name,
        uri: asset.uri,
        fileUrl: uploaded.fileUrl,
        mimeType: uploaded.mimeType || mimeType,
        sizeBytes: uploaded.sizeBytes,
      };

      setKycDocument({
        slot,
        fileUrl: next.fileUrl,
        fileName: next.name,
        mimeType: next.mimeType,
        sizeBytes: next.sizeBytes,
        localUri: next.uri,
      });
      onChange(next);
      alertSuccess('Document uploaded.', 'Uploaded');
    } catch (error) {
      alertError(error, 'Upload failed');
    } finally {
      stopProgress();
      setUploading(false);
    }
  }

  if (value && !uploading) {
    return (
      <View className="gap-3">
        <View className="overflow-hidden rounded-[16px] bg-[#F3F4F6]">
          <Image source={{ uri: value.uri }} style={{ width: '100%', height: 160 }} contentFit="cover" />
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
            onPress={() => {
              clearKycDocument(slot);
              onChange(null);
            }}
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

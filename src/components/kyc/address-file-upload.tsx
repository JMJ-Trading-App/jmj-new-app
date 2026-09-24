import * as DocumentPicker from 'expo-document-picker';
import Svg, { Path, Rect } from 'react-native-svg';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { UploadIcon } from '@/components/invest/invest-flow-icons';
import { alertError, alertSuccess } from '@/lib/errors';
import { clearKycDocument, setKycDocument } from '@/lib/kyc-draft';
import { uploadKycFile } from '@/lib/kyc';

export type AddressFileValue = {
  name: string;
  sizeLabel: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes?: number;
  uri?: string;
};

type AddressFileUploadProps = {
  value: AddressFileValue | null;
  onChange: (value: AddressFileValue | null) => void;
};

function formatBytes(bytes?: number) {
  if (!bytes) return 'Uploaded';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function PdfFileIcon({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Rect x={6} y={4} width={24} height={28} rx={3} fill="#F5E8B0" />
      <Path
        d="M12 12H24M12 17H24M12 22H19"
        stroke="#C4A015"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function AddressFileUpload({ value, onChange }: AddressFileUploadProps) {
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
      setProgress((current) => Math.min(current + 12, 90));
    }, 70);
  }

  function stopProgress() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setProgress(100);
  }

  async function startUpload() {
    if (uploading) return;

    const picked = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (picked.canceled || !picked.assets?.[0]) return;

    const asset = picked.assets[0];
    const name = asset.name || 'address-document.pdf';
    const mimeType = asset.mimeType || 'application/pdf';

    setUploading(true);
    startProgress();

    try {
      const uploaded = await uploadKycFile({
        uri: asset.uri,
        name,
        type: mimeType,
      });

      const next: AddressFileValue = {
        name: uploaded.fileName || name,
        sizeLabel: formatBytes(uploaded.sizeBytes ?? asset.size),
        fileUrl: uploaded.fileUrl,
        mimeType: uploaded.mimeType || mimeType,
        sizeBytes: uploaded.sizeBytes ?? asset.size,
        uri: asset.uri,
      };

      setKycDocument({
        slot: 'ADDRESS',
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
      <View className="flex-row items-center gap-3 rounded-[16px] border border-success bg-white px-3.5 py-3.5">
        <PdfFileIcon />
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="font-geist-semibold text-[15px] text-stone-title" numberOfLines={1}>
            {value.name}
          </Text>
          <Text className="font-geist text-[13px]">
            <Text className="text-muted">{value.sizeLabel}</Text>
            <Text className="text-muted"> • </Text>
            <Text className="text-success">Uploaded</Text>
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Remove uploaded document"
          onPress={() => {
            clearKycDocument('ADDRESS');
            onChange(null);
          }}
          className="h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F6]"
          style={({ pressed }) => [pressed && { opacity: 0.8 }]}>
          <Text className="font-geist-semibold text-[14px] text-muted">✕</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Tap to upload document"
      disabled={uploading}
      onPress={startUpload}
      className="items-center justify-center gap-2 rounded-[16px] border border-dashed border-[#D1D5DB] px-4 py-8"
      style={({ pressed }) => [pressed && !uploading && { opacity: 0.9 }]}>
      <UploadIcon color="#C4A015" size={28} />
      <Text className="font-geist-semibold text-[15px] text-stone-title">Tap to upload document</Text>
      <Text className="font-geist text-[12px] text-muted">DOC or PDF, max 5MB</Text>

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

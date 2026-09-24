import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import Svg, { Ellipse } from 'react-native-svg';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { KycFlowShell } from '@/components/kyc/kyc-flow-shell';
import { CheckmarkBadgeIcon } from '@/components/pool/pool-icons';
import { KYC_SELFIE_TIPS } from '@/constants/kyc-data';
import { KycFlowGateLoading, useKycFlowGate } from '@/hooks/use-kyc-flow-gate';
import { alertError, alertSuccess } from '@/lib/errors';
import { setKycDocument } from '@/lib/kyc-draft';
import { uploadKycFile } from '@/lib/kyc';

const FRAME_SIZE = 280;

export default function KycSelfieScreen() {
  const gated = useKycFlowGate();
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (gated) return <KycFlowGateLoading />;

  async function handleTakePhoto() {
    if (uploading) return;

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      // Fall back to library if camera is unavailable (e.g. web / simulator).
      const library = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!library.granted) {
        alertError(new Error('Camera or photo permission is required.'), 'Permission needed');
        return;
      }
    }

    const picked = permission.granted
      ? await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          quality: 0.7,
          exif: false,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.7,
          exif: false,
        });

    if (picked.canceled || !picked.assets[0]) return;

    const asset = picked.assets[0];
    const name = asset.fileName ?? `selfie-${Date.now()}.jpg`;
    const mimeType =
      asset.mimeType && asset.mimeType !== 'image'
        ? asset.mimeType
        : 'image/jpeg';

    // Let the camera UI fully dismiss before starting the network upload.
    await new Promise((resolve) => setTimeout(resolve, 250));

    setUploading(true);
    try {
      const uploaded = await uploadKycFile({
        uri: asset.uri,
        name,
        type: mimeType,
      });

      setKycDocument({
        slot: 'SELFIE',
        fileUrl: uploaded.fileUrl,
        fileName: uploaded.fileName || name,
        mimeType: uploaded.mimeType || mimeType,
        sizeBytes: uploaded.sizeBytes,
        localUri: asset.uri,
      });
      setSelfieUri(asset.uri);
      alertSuccess('Selfie uploaded.', 'Uploaded');
      router.push('/kyc/proof-of-address' as Href);
    } catch (error) {
      alertError(error, 'Selfie upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <KycFlowShell
      title="Selfie Verification"
      step={2}
      footer={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Take Photo"
          disabled={uploading}
          onPress={handleTakePhoto}
          className="flex-row items-center justify-center gap-2 rounded-[14px] bg-stone-title py-[18px]"
          style={({ pressed }) => [pressed && !uploading && { opacity: 0.88 }]}>
          {uploading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <SymbolView name="camera.fill" size={18} tintColor="#FFFFFF" />
          )}
          <Text className="font-geist-semibold text-[16px] text-white">
            {uploading ? 'Uploading…' : selfieUri ? 'Retake & Continue' : 'Take Photo'}
          </Text>
        </Pressable>
      }>
      <View className="flex-1 items-center gap-8">
        <View
          className="items-center justify-center overflow-hidden rounded-full border-2 border-[#F5E8B0] bg-[#5C5C5C]"
          style={{ width: FRAME_SIZE, height: FRAME_SIZE }}>
          {selfieUri ? (
            <Image
              source={{ uri: selfieUri }}
              style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
              contentFit="cover"
            />
          ) : (
            <Svg width={FRAME_SIZE * 0.72} height={FRAME_SIZE * 0.88}>
              <Ellipse
                cx={(FRAME_SIZE * 0.72) / 2}
                cy={(FRAME_SIZE * 0.88) / 2}
                rx={(FRAME_SIZE * 0.72) / 2 - 2}
                ry={(FRAME_SIZE * 0.88) / 2 - 2}
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeDasharray="8 7"
                fill="none"
              />
            </Svg>
          )}
        </View>

        <View className="w-full gap-4 px-1">
          {KYC_SELFIE_TIPS.map((tip) => (
            <View key={tip} className="flex-row items-center gap-3">
              <CheckmarkBadgeIcon size={22} />
              <Text className="flex-1 font-geist text-[15px] leading-[22px] text-stone-title">
                {tip}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </KycFlowShell>
  );
}

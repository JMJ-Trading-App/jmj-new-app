import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/api/client';
import { alertError, alertSuccess } from '@/lib/errors';

export default function SupportMessageScreen() {
  const insets = useSafeAreaInsets();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function send() {
    if (sending) return;
    setSending(true);
    try {
      const result = await apiRequest<{ message: string }>('/support/contact', {
        method: 'POST',
        auth: true,
        body: { subject: subject.trim(), message: message.trim() },
      });
      alertSuccess(result.message);
      setSubject('');
      setMessage('');
      router.back();
    } catch (error) {
      alertError(error, 'Could not send your message');
    } finally {
      setSending(false);
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-4 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            Contact support
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <View className="gap-4 px-5">
        <Text className="font-geist text-[14px] leading-[20px] text-stone-body">
          Send a message to JMJ support. A copy is emailed to the support desk and saved in your notifications.
        </Text>
        <TextInput
          value={subject}
          onChangeText={setSubject}
          placeholder="Subject"
          placeholderTextColor="#A8A29E"
          className="rounded-[14px] border border-[#E7E5E4] px-4 py-3 font-geist text-[15px] text-stone-title"
        />
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="How can we help?"
          placeholderTextColor="#A8A29E"
          multiline
          textAlignVertical="top"
          className="min-h-[140px] rounded-[14px] border border-[#E7E5E4] px-4 py-3 font-geist text-[15px] text-stone-title"
        />
        <Button
          label="Send message"
          loading={sending}
          disabled={subject.trim().length < 3 || message.trim().length < 8}
          onPress={() => void send()}
        />
      </View>
    </View>
  );
}

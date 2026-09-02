import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function InvestFlowLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </>
  );
}

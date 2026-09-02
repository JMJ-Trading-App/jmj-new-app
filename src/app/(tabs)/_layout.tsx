import { StatusBar } from 'expo-status-bar';

import AppTabs from '@/components/app-tabs';

export default function TabsLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <AppTabs />
    </>
  );
}

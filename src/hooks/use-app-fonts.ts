import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import {
  GeistMono_500Medium,
  GeistMono_700Bold,
} from '@expo-google-fonts/geist-mono';
import { useFonts } from 'expo-font';

export function useAppFonts() {
  return useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    GeistMono_500Medium,
    GeistMono_700Bold,
  });
}

import { apiRequest } from '@/lib/api/client';
import {
  HELP_CENTER_ITEMS,
  type HelpCenterItem,
} from '@/constants/help-center-data';

export type SupportSettings = {
  supportPhone: string;
  supportEmail: string;
  whatsappUrl: string;
  instagramUrl: string;
  xUrl: string;
  faqUrl: string | null;
  termsUrl: string | null;
  privacyUrl: string | null;
  updatedAt?: string;
};

export const DEFAULT_SUPPORT_SETTINGS: SupportSettings = {
  supportPhone: '+2348012345678',
  supportEmail: 'support@jmj.com',
  whatsappUrl: 'https://wa.me/',
  instagramUrl: 'https://instagram.com/',
  xUrl: 'https://x.com/',
  faqUrl: null,
  termsUrl: null,
  privacyUrl: null,
};

let cache: SupportSettings | null = null;
let inflight: Promise<SupportSettings> | null = null;

export async function fetchSupportSettings(options?: {
  force?: boolean;
}): Promise<SupportSettings> {
  if (!options?.force && cache) return cache;
  if (!options?.force && inflight) return inflight;

  inflight = apiRequest<SupportSettings>('/support')
    .then((settings) => {
      cache = {
        ...DEFAULT_SUPPORT_SETTINGS,
        ...settings,
        supportPhone: settings.supportPhone || DEFAULT_SUPPORT_SETTINGS.supportPhone,
        supportEmail: settings.supportEmail || DEFAULT_SUPPORT_SETTINGS.supportEmail,
        whatsappUrl: settings.whatsappUrl || DEFAULT_SUPPORT_SETTINGS.whatsappUrl,
        instagramUrl: settings.instagramUrl || DEFAULT_SUPPORT_SETTINGS.instagramUrl,
        xUrl: settings.xUrl || DEFAULT_SUPPORT_SETTINGS.xUrl,
        faqUrl: settings.faqUrl ?? null,
        termsUrl: settings.termsUrl ?? null,
        privacyUrl: settings.privacyUrl ?? null,
      };
      return cache;
    })
    .catch(() => {
      cache = cache ?? DEFAULT_SUPPORT_SETTINGS;
      return cache;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function helpCenterItemsFromSettings(
  settings: SupportSettings,
): HelpCenterItem[] {
  return HELP_CENTER_ITEMS.map((item) => {
    switch (item.id) {
      case 'call':
        return { ...item, value: settings.supportPhone };
      case 'email':
        return { ...item, value: settings.supportEmail };
      case 'faq':
        return settings.faqUrl
          ? { ...item, action: 'url' as const, value: settings.faqUrl }
          : { ...item, action: 'noop' as const, value: undefined };
      case 'instagram':
        return { ...item, value: settings.instagramUrl };
      case 'x':
        return { ...item, value: settings.xUrl };
      case 'whatsapp':
        return { ...item, value: settings.whatsappUrl };
      default:
        return item;
    }
  });
}

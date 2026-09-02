export type HelpCenterAction = 'tel' | 'mailto' | 'url' | 'noop';

export type HelpCenterItem = {
  id: string;
  label: string;
  icon: 'call' | 'email' | 'faq' | 'instagram' | 'x' | 'whatsapp';
  action: HelpCenterAction;
  value?: string;
};

export const HELP_CENTER_ITEMS: HelpCenterItem[] = [
  {
    id: 'call',
    label: 'Call Us',
    icon: 'call',
    action: 'tel',
    value: '+2348012345678',
  },
  {
    id: 'email',
    label: 'Send an Email',
    icon: 'email',
    action: 'mailto',
    value: 'support@jmj.com',
  },
  {
    id: 'faq',
    label: 'Frequently Asked Questions',
    icon: 'faq',
    action: 'noop',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: 'instagram',
    action: 'url',
    value: 'https://instagram.com/',
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    icon: 'x',
    action: 'url',
    value: 'https://x.com/',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'whatsapp',
    action: 'url',
    value: 'https://wa.me/',
  },
];

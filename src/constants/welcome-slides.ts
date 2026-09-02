export type WelcomeSlide = {
  hero: number;
  message: string;
};

export const WELCOME_SLIDES: WelcomeSlide[] = [
  {
    hero: require('@/assets/images/welcome/welcome-1-hero.png'),
    message:
      'Join thousands of traders using signals, pool funding, and smart tools to level up.',
  },
  {
    hero: require('@/assets/images/welcome/welcome-2-hero.png'),
    message: 'Track your trading accounts, balances, and performance in real-time.',
  },
  {
    hero: require('@/assets/images/welcome/welcome-3-hero.png'),
    message: 'Get expert trade calls sent straight to you, so you never miss a move.',
  },
  {
    hero: require('@/assets/images/welcome/welcome-4-hero.png'),
    message:
      'Access pooled funds and trade with more capital, backed by the JMJ community.',
  },
];

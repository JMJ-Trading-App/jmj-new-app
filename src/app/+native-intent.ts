export function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}): string | null {
  try {
    if (path.includes('payment/return')) {
      return initial ? '/(tabs)/home' : null;
    }
    return path;
  } catch {
    return '/(tabs)/home';
  }
}

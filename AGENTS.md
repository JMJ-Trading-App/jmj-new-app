# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Styling

This project uses **NativeWind v4** (Tailwind CSS for React Native).

- Use `className` on `View`, `Text`, `Pressable`, `TextInput`, etc.
- Use `cn()` from `@/lib/cn` for conditional classes
- Design tokens live in `tailwind.config.js` — extend there instead of adding StyleSheet tokens
- Do not add new `StyleSheet.create` usage
- Import `@/global.css` only in `src/app/_layout.tsx` (already done)
- **`expo-image` `Image` does not reliably size via `className`** — always set `width`/`height` (or absolute fill) with `style`

/** @type {import('expo/config').ExpoConfig} */

const env = {
  appName: 'JMJ',
  appSlug: 'jmj-trading-app',
  scheme: 'jmjtradingapp',
  iosBundleId: 'com.thejmjapp.app',
  androidPackage: 'com.thejmjapp.app',
};

module.exports = {
  name: env.appName,
  slug: env.appSlug,
  version: '1.2.6',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: env.scheme,
  userInterfaceStyle: 'light',
  newArchEnabled: true,

  ios: {
    supportsTablet: false,
    bundleIdentifier: env.iosBundleId,
    icon: './assets/images/icon.png',
    infoPlist: {
      "UIDeviceFamily": [1],
      NSFaceIDUsageDescription:
        'Use Face ID to securely unlock your JMJ account without typing your PIN.',
      UIBackgroundModes: ['remote-notification'],
      // HTTPS + OS Keychain/Keystore + SHA-256 PIN hash only — no non-exempt crypto
      ITSAppUsesNonExemptEncryption: false,
    },
  },

  android: {
    package: env.androidPackage,
    versionCode: 9,
    // Local Nest API over HTTP (LAN / emulator). Prefer HTTPS in store builds.
    usesCleartextTraffic: true,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON || './google-services.json',
    adaptiveIcon: {
      backgroundColor: '#F5C518',
      foregroundImage: './assets/images/icon.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },

  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },

  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F5C518',
        image: './assets/images/brand-logo.png',
        imageWidth: 120,
      },
    ],
    '@react-native-community/datetimepicker',
    'expo-secure-store',
    [
      'expo-image-picker',
      {
        photosPermission:
          'Allow JMJ to access your photos for KYC verification.',
        cameraPermission:
          'Allow JMJ to use your camera for KYC selfie verification.',
      },
    ],
    'expo-document-picker',
    [
      'expo-local-authentication',
      {
        faceIDPermission:
          'Allow JMJ to use Face ID to unlock your account.',
      },
    ],
    [
      'expo-notifications',
      {
        color: '#F5C518',
        defaultChannel: 'default',
        // Must be white silhouette on transparent (Android guideline)
        icon: './assets/images/notification-icon.png',
      },
    ],
  ],

  extra: {
    apiUrl:
      process.env.EXPO_PUBLIC_API_URL?.trim() || 'https://api.jmj.finance/v1',
    eas: {
      projectId: '2f34847e-ce67-4a47-ae0c-59255c70c787',
    },
  },

  experiments: {
    typedRoutes: true,
  },
};

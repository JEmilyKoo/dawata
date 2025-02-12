import { ConfigContext, ExpoConfig } from '@expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'dawata',
  slug: 'dawata',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'dawata',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-localization',
    [
      'expo-build-properties',
      {
        android: {
          extraMavenRepos: [
            'https://devrepo.kakao.com/nexus/content/groups/public/',
          ],
        },
      },
    ],
    [
      '@react-native-kakao/core',
      {
        nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_MAP_JS_API_KEY || '',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    kakaoApiKey: process.env.EXPO_PUBLIC_KAKAO_MAP_JS_API_KEY || '',
  },
})

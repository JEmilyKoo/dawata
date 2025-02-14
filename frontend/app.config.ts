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
    bundleIdentifier: 'com.dawata.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.dawata.app',
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
          newArchEnabled: true,
        },
        ios: {
          newArchEnabled: true,
        },
      },
    ],
    [
      '@react-native-kakao/core',
      {
        nativeAppKey: '652d77a471c85e5f7e31db12c3fde710',
        android: {
          authCodeHandlerActivity: true,
        },
        ios: {
          handleKakaoOpenUrl: true,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    kakaoApiKey: '49cbb38f80c95bb1992816e24798f649',
    eas: {
      projectId: 'ff7cb7b0-6a29-4f0c-a746-9350a2b54a54',
    },
  },
})

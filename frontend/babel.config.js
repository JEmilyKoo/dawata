module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'babel-plugin-module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            app: './src/app',
          },
        },
      ],
    ],
  }
}

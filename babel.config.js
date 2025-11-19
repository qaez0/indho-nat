module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};

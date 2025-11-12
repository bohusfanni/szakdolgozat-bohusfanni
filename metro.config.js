// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 🔧 1) Kapcsoljuk ki a package.json "exports" alapú feloldást,
// mert ez kavar be a Firebase Auth-nál Expo 53/54 alatt.
config.resolver.unstable_enablePackageExports = false;

// 🔧 2) Engedjük a .cjs fájlokat is forrásként (Firebase belsőleg használja)
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'cjs',
];

module.exports = config;

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for shared package
config.resolver.alias = {
  '@qoncier/shared': require('path').resolve(__dirname, '../shared/src'),
};

module.exports = config;

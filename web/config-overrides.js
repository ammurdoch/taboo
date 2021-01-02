/* eslint-disable react-hooks/rules-of-hooks */
const {
  useBabelRc,
  override,
  useEslintRc,
  addLessLoader,
} = require('customize-cra');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = override(
  (config) => {
    config.resolve.plugins = config.resolve.plugins.filter(
      (plugin) => !(plugin instanceof ModuleScopePlugin),
    );
    return config;
  },
  useBabelRc(),
  useEslintRc(),
  addLessLoader({
    lessOptions: {
      modifyVars: {
        '@font-size-base': '16px',
        '@heading-color': '#0d3322',
        '@text-color': '#111212',
        '@text-color-secondary': '#999',
        '@primary-color': '#3bdb95',
        '@padding-lg': '32px',
        '@padding-md': '24px',
        '@padding-sm': '16px',
        '@padding-xs': '12px',
        '@padding-xss': '8px',
        '@height-base': '42px',
        '@height-lg': '50px',
        '@height-sm': '36px',
        '@margin-lg': '32px',
        '@margin-md': '24px',
        '@margin-sm': '16px',
        '@margin-xs': '12px',
        '@margin-xss': '8px',
        '@form-item-label-colon-margin-right': '12px',
        '@form-item-label-colon-margin-left': '4px',
      },
      javascriptEnabled: true,
    },
  }),
);

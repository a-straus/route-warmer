/* config-overrides.js */

module.exports = function override(config, env) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  };
  return config;
};

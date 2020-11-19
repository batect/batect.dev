const plugin = function () {
  return {
    name: "yaml-loader",
    configureWebpack() {
      return {
        module: {
          rules: [
            {
              test: /\.yml$/,
              use: [
                {
                  loader: require.resolve("raw-loader"),
                },
              ],
            },
          ],
        },
      };
    },
  };
};

module.exports = plugin;

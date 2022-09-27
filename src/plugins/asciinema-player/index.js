const webpackUtils = require("@docusaurus/utils");

const plugin = function () {
  return {
    name: "asciinema-player",

    configureWebpack() {
      const { loaders } = webpackUtils.getFileLoaderUtils();

      return {
        module: {
          rules: [
            {
              test: /\.cast$/,
              use: [loaders.file({ folder: "asciicasts" })],
            },
          ],
        },
      };
    },
  };
};

module.exports = plugin;

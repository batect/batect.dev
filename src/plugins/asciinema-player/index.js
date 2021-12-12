const webpackUtils = require("@docusaurus/utils");
const paths = require("./paths");

const plugin = function () {
  return {
    name: "asciinema-player",

    // Why do we do this instead of using getClientModules()?
    // I couldn't get getClientModules() to work - I suspect this is because the NPM package includes a fully compiled,
    // minified version of the player, which doesn't play nicely with module loading.
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              href: paths.css,
              rel: "stylesheet",
              type: "text/css",
            },
          },
        ],
      };
    },
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

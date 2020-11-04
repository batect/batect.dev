const utils = require("@docusaurus/core/lib/webpack/utils");
const staticDirectory = "/thirdparty/asciinema-2.6.1";

module.exports = function (context, options) {
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
              href: `${staticDirectory}/asciinema-player.css`,
              rel: "stylesheet",
              type: "text/css",
            },
          },
        ],
        postBodyTags: [
          {
            tagName: "script",
            attributes: {
              charset: "utf-8",
              src: `${staticDirectory}/asciinema-player.js`,
            },
          },
        ],
      };
    },
    configureWebpack() {
      const { loaders } = utils.getFileLoaderUtils();

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

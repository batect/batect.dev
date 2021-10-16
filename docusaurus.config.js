const path = require("path");
const copyright = `Copyright © 2017-${new Date().getFullYear()} Charles Korn.`;
const url = process.env["SITE_URL"] || "https://batect.dev";

const plugins = ["asciinema-player", "yaml-loader"];
const pluginPaths = plugins.map((plugin) => path.resolve(__dirname, `src/plugins/${plugin}`));

module.exports = {
  title: "Batect",
  url: url,
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.svg",
  organizationName: "batect",
  projectName: "batect.dev",
  themeConfig: {
    colorMode: {
      disableSwitch: true,
    },
    navbar: {
      title: "", // The site title is embedded in the logo.
      logo: {
        alt: "Batect",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          to: "bundles/",
          activeBasePath: "bundles",
          label: "Bundles",
          position: "left",
        },
        {
          to: "blog",
          label: "Blog",
          position: "left",
        },
        {
          href: "https://github.com/batect/batect",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://github.com/batect/batect/discussions",
          label: "Chat",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright,
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Config file reference",
              to: "/docs/reference/config",
            },
            {
              label: "CLI reference",
              to: "/docs/reference/cli",
            },
            {
              label: "Cheat sheet",
              to: "/docs/reference/cheat-sheet",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Bundles",
              to: "/bundles",
            },
            {
              label: "GitHub",
              to: "https://github.com/batect",
            },
            {
              label: "Chat",
              to: "https://github.com/batect/batect/discussions",
            },
          ],
        },
        {
          title: "Legal",
          items: [
            {
              label: "Privacy",
              to: "/privacy",
            },
          ],
        },
      ],
    },
    gtag: {
      trackingID: "UA-63947227-2",
    },
    algolia: {
      appId: "7ZUQMR16DB",
      apiKey: "b64eb1331543944c3e6abde8dc22c948",
      indexName: "prod",
    },
    prism: {
      theme: require("prism-react-renderer/themes/github"),
      additionalLanguages: ["bash", "docker"],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.ts"),
          sidebarCollapsible: false,
          editUrl: "https://github.com/batect/batect.dev/blob/main/",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/batect/batect.dev/blob/main/",
          feedOptions: {
            type: "all",
            copyright,
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: pluginPaths,
};

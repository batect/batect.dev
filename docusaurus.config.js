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
  favicon: "img/favicon.ico",
  organizationName: "batect",
  projectName: "batect.dev",
  themeConfig: {
    colorMode: {
      disableSwitch: true,
    },
    sidebarCollapsible: false,
    navbar: {
      title: "Batect",
      logo: {
        alt: "My Site Logo",
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
          href: "https://spectrum.chat/batect",
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
              to: "https://spectrum.chat/batect",
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
    googleAnalytics: {
      trackingID: "UA-63947227-2",
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
          editUrl: "https://github.com/batect/batect.dev/edit/main/",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/batect/batect.dev/edit/main/",
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

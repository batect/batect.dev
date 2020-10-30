let copyright = `Copyright © 2017-${new Date().getFullYear()} Charles Korn.`;
module.exports = {
  title: "Batect",
  url: "https://batect.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "batect",
  projectName: "batect.dev",
  themeConfig: {
    colorMode: {
      disableSwitch: true,
    },
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
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Style Guide",
              to: "docs/",
            },
            {
              label: "Second Doc",
              to: "docs/doc2/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/docusaurus",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/docusaurus",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/batect/batect",
            },
          ],
        },
      ],
      copyright,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.ts"),
          editUrl: "https://github.com/batect/batect.dev/edit/master/",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/batect/batect.dev/edit/master/",
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
};

const sidebar = [
  {
    type: "category",
    label: "Getting started",
    items: [
      "getting-started/hello-world",
      "getting-started/requirements",
      "getting-started/installation",
      "getting-started/tutorial",
      "getting-started/sample-projects",
      "getting-started/shell-tab-completion",
      "getting-started/comparison",
    ],
  },
  {
    type: "category",
    label: "Concepts",
    items: [
      "concepts/tasks",
      "concepts/containers",
      "concepts/caches",
      "concepts/includes-and-bundles",
      "concepts/task-lifecycle",
      "concepts/run-as-current-user-mode",
    ],
  },
  {
    type: "category",
    label: "Reference",
    items: [
      {
        type: "category",
        label: "Config file reference",
        items: [
          "reference/config/overview",
          "reference/config/config-variables",
          "reference/config/containers",
          "reference/config/includes",
          "reference/config/tasks",
          "reference/config/expressions",
        ],
      },
      {
        type: "doc",
        id: "reference/cli",
      },
      {
        type: "doc",
        id: "reference/cheat-sheet",
      },
    ],
  },
  {
    type: "category",
    label: "Using Batect with other tools and ecosystems",
    items: [
      "using-batect-with/tools/index",
      "using-batect-with/tools/docker",
      "using-batect-with/tools/golang",
      "using-batect-with/tools/gradle",
      "using-batect-with/tools/net-core",
      "using-batect-with/tools/nodejs",
      "using-batect-with/tools/ruby",
      "using-batect-with/tools/seq",
    ],
  },
  {
    type: "category",
    label: "Using Batect with CI systems",
    items: [
      "using-batect-with/ci/general",
      "using-batect-with/ci/buildkite",
      "using-batect-with/ci/circleci",
      "using-batect-with/ci/github-actions",
      "using-batect-with/ci/travis-ci",
    ],
  },
  {
    type: "category",
    label: "How to guides",
    items: [
      "how-to/ide-integration",
      "how-to/performance",
      "how-to/migrate-existing-codebase",
      "how-to/migrate-from-docker-compose",
      "how-to/build-artefacts-owned-by-root",
      "how-to/wait-for-dependencies",
      "how-to/proxies",
    ],
  },
];

module.exports = {
  sidebar,
};

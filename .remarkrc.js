module.exports = {
  plugins: [
    // https://github.com/remarkjs/remark-lint#list-of-presets
    "remark-preset-lint-consistent",
    "remark-preset-lint-markdown-style-guide",
    "remark-preset-lint-recommended",

    // https://github.com/remarkjs/remark-lint#list-of-external-rules
    "remark-lint-match-punctuation",

    "remark-lint-no-duplicate-headings-in-section",
    "remark-lint-no-tabs",
    "remark-lint-no-trailing-spaces",
    "remark-validate-links",

    [
      require("remark-retext"),
      require("unified")()
        .use(require("retext-english"))
        .use(require("retext-syntax-mentions"))
        .use(require("retext-syntax-urls"))
        .use(require("retext-diacritics"))
        .use(require("retext-indefinite-article"))
        .use(require("retext-redundant-acronyms"))
        .use(require("retext-repeated-words"))
        .use(require("retext-sentence-spacing")),
    ],

    // Rules enabled by default by presents above that we don't want
    ["remark-lint-file-extension", false],
    ["remark-lint-heading-style", false],
    ["remark-lint-list-item-indent", false],
    ["remark-lint-maximum-heading-length", false],
    ["remark-lint-maximum-line-length", false],
    ["remark-lint-no-duplicate-headings", false],

    // Style options that differ from presets above
    ["remark-lint-ordered-list-marker-value", "ordered"],
    ["remark-lint-emphasis-marker", "_"],
    ["remark-lint-no-undefined-references", false],
  ],
};

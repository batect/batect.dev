import { unified } from "unified";

import remark_retext from "remark-retext";
import retext_english from "retext-english";
import retext_syntax_mentions from "retext-syntax-mentions";
import retext_syntax_urls from "retext-syntax-urls";
import retext_diacritics from "retext-diacritics";
import retext_indefinite_article from "retext-indefinite-article";
import retext_redundant_acronyms from "retext-redundant-acronyms";
import retext_repeated_words from "retext-repeated-words";
import retext_sentence_spacing from "retext-sentence-spacing";

export default {
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
      remark_retext,
      unified()
        .use(retext_english)
        .use(retext_syntax_mentions)
        .use(retext_syntax_urls)
        .use(retext_diacritics)
        .use(retext_indefinite_article)
        .use(retext_redundant_acronyms)
        .use(retext_repeated_words)
        .use(retext_sentence_spacing),
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

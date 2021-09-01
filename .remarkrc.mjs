import { readFileSync } from "fs";
import { unified } from "unified";

import remarkRetext from "remark-retext";
import retextEnglish from "retext-english";
import retextSyntaxMentions from "retext-syntax-mentions";
import retextSyntaxUrls from "retext-syntax-urls";
import retextDiacritics from "retext-diacritics";
import retextIndefiniteArticle from "retext-indefinite-article";
import retextRedundantAcronyms from "retext-redundant-acronyms";
import retextRepeatedWords from "retext-repeated-words";
import retextSentenceSpacing from "retext-sentence-spacing";
import retextSpell from "retext-spell";
import dictionary from "dictionary-en-au";

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
      remarkRetext,
      unified()
        .use(retextEnglish)
        .use(retextSyntaxMentions)
        .use(retextSyntaxUrls)
        .use(retextDiacritics)
        .use(retextIndefiniteArticle)
        .use(retextRedundantAcronyms)
        .use(retextRepeatedWords)
        .use(retextSentenceSpacing)
        .use(retextSpell, {
          dictionary: dictionary,
          personal: readFileSync("dictionary.txt"),
        }),
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

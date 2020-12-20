---
title: Renovate
---

<!-- Note: the contents of this file are included into keep-batect-up-to-date.mdx - keep this in mind when using headings. -->

[Renovate](https://renovatebot.com) can help keep your project up-to-date automatically. It's a tool that scans your repository for dependencies, identifies which ones are out of date
and then sends you PRs to update them.

Renovate has built-in support for Batect, and in its default configuration will automatically send you PRs to update Batect itself and
any images or bundles you project uses. In addition to this, it also has support for updating base image references in Dockerfiles.

By default, Renovate will only update image or bundle references in files named `batect.yml` or `batect-bundle.yml`. If you use
[file includes](../../reference/config/includes.md#file-includes) to split your configuration over multiple files, you'll need to
configure which files to search with `fileMatch` in your `renovate.json`:

<!-- prettier-ignore-start -->
```json title="renovate.json" {5-6}
{
  "batect": {
    "fileMatch": [
      "(^|/)batect(-bundle)?\\.yml$",
      "(^|/)my-other-batect-file\\.yml$",
      "^a-directory/[^/]*\\.yml$",
      "^a-directory-with-subdirectories/.*\\.yml$"
    ]
  }
}
```
<!-- prettier-ignore-end -->

`fileMatch` should be an array of regular expressions that will be matched against the path to the file, relative to the root
of the repository. So, for example:

- `(^|/)batect(-bundle)?\\.yml$` matches any file called `batect.yml` or `batect-bundle.yml` in any directory
- `^a-directory/[^/]*\\.yml$` matches any file ending with `.yml` directly beneath `a-directory` in the root of the repository
- `^a-directory-with-subdirectories/.*\\.yml$` matches any file ending with `.yml` beneath `a-directory-with-subdirectories` in the root of the repository, including in subdirectories

For more information, consult [Renovate's Batect manager documentation](https://docs.renovatebot.com/modules/manager/batect/).

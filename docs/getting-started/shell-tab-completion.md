---
title: Shell tab completion
---

Shell tab completion makes it faster to work with Batect. Rather than having to remember [CLI options](../reference/cli.md) or task names, you can type the
start of the name, press <kbd>Tab</kbd>, and the name will be filled in for you automatically.

:::info
Shell tab completion is a new feature with support for a limited set of shells. Support for other shells such as Bash and zsh will be added soon.

Follow issue [#116](https://github.com/batect/batect/issues/116) to be notified of new releases.
:::

## Fish

If you're using [Homebrew](https://brew.sh), install support for Batect's tab completion with `brew install batect/batect/batect-fish-completion`.

Otherwise, you can install support for Batect's tab completion using [Fisher](https://github.com/jorgebucaran/fisher) with `fisher add batect/fish-completion`.

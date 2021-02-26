---
title: Shell tab completion
---

Shell tab completion makes it faster to work with Batect. Rather than having to remember [CLI options](../reference/cli.mdx) or task names, you can type the
start of the name, press <kbd>Tab</kbd>, and the name will be filled in for you automatically.

:::info
Shell tab completion is a new feature with support for a limited set of shells. Support for other shells such as Bash will be added soon.

Follow issue [#116](https://github.com/batect/batect/issues/116) to be notified of new releases.
:::

## Fish

If you're using [Homebrew](https://brew.sh), install support for Batect's tab completion with `brew install batect/batect/batect-fish-completion`.

Otherwise, you can install support for Batect's tab completion using [Fisher](https://github.com/jorgebucaran/fisher) with `fisher add batect/fish-completion`.

## Zsh

If you're using [Homebrew](https://brew.sh), install support for Batect's tab completion with `brew install batect/batect/batect-zsh-completion`.

If you're using [Oh My Zsh](https://ohmyz.sh/), follow the instructions in the [zsh-completion readme](https://github.com/batect/zsh-completion#with-oh-my-zsh)
to install support for Batect's tab completion.

Otherwise, you'll need to manually install the completion script, which is available in the
[`zsh-completion` repository on GitHub](https://github.com/batect/zsh-completion/tree/main/_batect).

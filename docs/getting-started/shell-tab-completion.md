---
title: Shell tab completion
---

Shell tab completion makes it faster to work with Batect. Rather than having to remember [CLI options](../reference/cli.mdx) or task names, you can type the
start of the name, press <kbd>Tab</kbd>, and the name will be filled in for you automatically.

For example, typing `./batect --he`<kbd>Tab</kbd> completes to `./batect --help` and typing `./batect bui`<kbd>Tab</kbd> completes to `./batect build`.

Batect supports shell tab completion in [Bash](#bash), [Fish](#fish) and [Zsh](#zsh).

In order to use shell tab completion, you'll need to install the completion script by following the instructions below for your shell.

## Bash

If you're using [Homebrew](https://brew.sh), install support for Batect's tab completion with `brew install batect/batect/batect-bash-completion`.

Otherwise, you'll need to manually install the completion script. Follow the [manual installation instructions](https://github.com/batect/batect-bash-completion#manual-install-with-bash-completion)
in the `bash-completion` repository on GitHub.

## Fish

If you're using [Homebrew](https://brew.sh), install support for Batect's tab completion with `brew install batect/batect/batect-fish-completion`.

Otherwise, you can install support for Batect's tab completion using [Fisher](https://github.com/jorgebucaran/fisher) with `fisher add batect/batect-fish-completion`.

## Zsh

If you're using [Homebrew](https://brew.sh), install support for Batect's tab completion with `brew install batect/batect/batect-zsh-completion`.

If you're using [Oh My Zsh](https://ohmyz.sh/), follow the instructions in the [batect-zsh-completion readme](https://github.com/batect/batect-zsh-completion#with-oh-my-zsh)
to install support for Batect's tab completion.

Otherwise, you'll need to manually install the completion script, which is available in the
[`zsh-completion` repository on GitHub](https://github.com/batect/batect-zsh-completion/tree/main/_batect).

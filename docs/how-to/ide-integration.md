---
title: IDE integration
---

## Editing `batect.yml`

:::tip
**tl;dr**: If your editor supports [schemastore.org](https://www.schemastore.org/json/) for YAML files, you'll get code completion
and other nice features when editing `batect.yml`
:::

Batect has a schema published on [schemastore.org](https://www.schemastore.org/json/), which means that if your editor supports
schemastore.org for YAML files, you'll get code completion, validation and other nice features automatically.

Editors known to support schemastore.org when editing YAML files include:

- Visual Studio Code with the [YAML Support by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) extension
- JetBrains IDEs (such as IntelliJ, PyCharm and RubyMine) starting with the 2018.2 release

## Coding assistance

Many IDEs rely on having the development environment installed locally in order to provide features like code completion,
analysis and tool integration. For example, a Ruby IDE might need access to a Ruby runtime, and a Java IDE might need
the target JVM to be installed.

However, if you're using Batect, then all of this is in a container and so the IDE can't access it.

Some solutions for this include:

- Some of the JetBrains family of products natively supports using a SDK or runtime from a container (PyCharm and RubyMine
  are known to work, although notably IntelliJ does not currently support this). There's more information on how to configure
  this in the [PyCharm docs](https://www.jetbrains.com/help/pycharm/using-docker-as-a-remote-interpreter.html) and
  [RubyMine docs](https://www.jetbrains.com/help/ruby/using-docker-as-a-remote-interpreter.html).

- The [Visual Studio Code Remote - Containers extension](https://code.visualstudio.com/docs/remote/containers) gives the option to
  use the local filesystem and code in a Docker container with your chosen language's runtime and other tools. All extensions
  and IDE features, including full IntelliSense, code navigation and debugging can be used.

- You could run a text-based editor such as Vim or Emacs in a container managed by Batect that has your
  required runtime components installed alongside it.

:::note
Have you tried something else that worked? Or do you use another IDE or text editor that supports using runtimes inside a
container? Please [submit a PR](https://github.com/batect/batect/pulls) to add to the list above.)
:::

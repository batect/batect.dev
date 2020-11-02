---
slug: /using-batect-with/tools
sidebar_label: Overview
title: Using Batect with other tools and ecosystems
---

Batect works with anything that can run in a Docker container.

Some tools require specific configuration to work well from within Docker or to take advantage of Batect's special features.

For example, every tool has its own way of caching downloaded dependencies or libraries. Your configuration file will need to
set up a [cache](../../concepts/caches.md) so that these dependencies are not lost every time the task finishes.

We have specific guidance for working with:

- [Docker](docker.md)
- [Golang](golang.md)
- [Gradle](gradle.md)
- [.NET Core](net-core.md)
- [Node.js](nodejs.md)
- [Ruby](ruby.md)
- [Seq](seq.md)

The [sample projects](../../getting-started/sample-projects.md) also show how to use Batect with a wide variety of tools and
ecosystems.

:::tip
If there's another tool or ecosystem not listed here that you use that requires specific configuration to work well with Batect, please consider
contributing documentation so that others can benefit from your knowledge.
:::

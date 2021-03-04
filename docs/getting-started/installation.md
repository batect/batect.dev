---
title: Installation
---

Follow these steps to set up Batect for the first time:

1. Download the latest version of `batect` and `batect.cmd` from the [releases page](https://github.com/batect/batect/releases),
   and copy these scripts into your project.

   Note that you only need the scripts - you don't need to download `batect.jar`.

   :::note
   The `batect` and `batect.cmd` scripts are designed to be committed alongside your project, and not installed globally. Committing
   the scripts alongside your code improves consistency within your team, as everyone uses the same version of Batect.

   The scripts will automatically pull down the correct version of Batect for your operating system.
   :::

2. If you're on Linux or macOS, make sure the script is executable: run `chmod +x batect`.

3. Create your `batect.yml` configuration file to define your tasks and the environments they run in.

   The documentation has a number of resources to help you with this. Each one is tailored to a different situation:

   - The [getting started tutorial](tutorial.md) gives an introduction to Batect

   - The [sample projects](sample-projects.md) show Batect in a number of real-world scenarios

   - If you're using Docker Compose, the [migrating from Docker Compose guide](../how-to/migrate-from-docker-compose.md) contains
     advice and links to a tool that can help you migrate

   - If you're adopting Batect in an existing codebase, the [migrating an existing codebase guide](../how-to/migrate-existing-codebase.md)
     contains advice on how to approach this

   - There are a number of guides for particular tools and ecosystems in the [Using Batect with other tools and ecosystems section](../using-batect-with/tools)

   - The [configuration file reference](../reference/config/overview.md) provides detailed information on every available configuration option

4. To enable tab completion in your shell, [set up shell tab completion](shell-tab-completion.md).

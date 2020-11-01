---
title: General advice for using Batect with CI systems
sidebar_label: General advice
---

## Requirements

Batect can be used with any CI system that can execute arbitrary commands.

CI agents must meet Batect's normal [system requirements](../../getting-started/requirements.md).

## Caching between builds

:::tip
**tl;dr**: Configure Batect to use directory mount [caches](../../concepts/caches.md) rather than Docker volumes by setting
the `BATECT_CACHE_TYPE` environment variable to `directory`, and then use your CI tool to cache the `.batect/caches` directory between CI runs.
:::

:::caution
Using directory caches is only recommended on Linux build agents. Using directory mounts for caches on macOS and Windows will result in a significant
performance degradation.
:::

If you are using caches to persist data between task invocations (eg. downloaded packages), this data may not be available on subsequent CI runs
if your CI system uses ephemeral agents.

By default, Batect uses Docker volumes for caches, which means they can't easily be shared between different machines. However, Batect also supports
using a directory mount for caches. On Linux machines, using directory mounts has no performance impact (unlike macOS and Windows), and also makes it
much easier to persist these caches between CI runs.

To use directory mounts for caches, either pass the `--cache-type=directory` CLI flag, or set the `BATECT_CACHE_TYPE` environment variable to `directory`.
Batect will then create directories in `.batect/caches`, and these can be cached by your CI tool between CI runs.

## Long-lived agents

:::tip
**tl;dr**: Set up a Cron job to run `docker image prune -f` regularly on long-lived CI agents
:::

If you are using Dockerfiles to define your containers (as opposed to using a pre-existing image), a large number of orphaned images
and image layers can build up over time. While Batect goes to great lengths to ensure that containers and networks are cleaned up
after every task run, it can't know which images are unused and so it can't safely automatically remove unused images.

These orphaned images take up disk space, and, if left unattended, can lead to exhausting all available disk space.
This is a particular problem on CI agents, where a human might not notice this issue until the disk is full.

Therefore, it's recommended that CI agents running Batect-based builds have a regular task that removes orphaned images.
Docker has a built-in command to do this: `docker image prune -f` (the `-f` disables the confirmation prompt). The exact
frequency will depend on your usage pattern, but once a day is usually more than sufficient.

## Port conflicts

:::tip
**tl;dr**: Disable binding of ports on the host system by running tasks with the
[`--disable-ports`](../../reference/cli.md#disable-port-binding-on-the-host-machine-disable-ports) flag
:::

If a single host machine can run multiple build jobs at the same time, and those build jobs run tasks that attempt to bind to the same port,
this can result in port conflicts and the build failing.

Normally, on CI, bound ports aren't used, so disabling them has no effect and prevents any issues caused by port conflicts.

To disable port bindings, run the task with `--disable-ports`. For example, run `the-task` with `./batect --disable-ports the-task`.

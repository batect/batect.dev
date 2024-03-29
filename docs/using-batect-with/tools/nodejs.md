---
title: Node.js
---

You can see an example of configuring and using TypeScript and Yarn with Batect in the [TypeScript sample project](https://github.com/batect/batect-sample-typescript),
and an example of using Cypress for UI testing with Batect in the [Cypress sample project](https://github.com/batect/batect-sample-cypress).

The [Node.js bundle](https://github.com/batect/node-bundle) provides a container with all of these options pre-configured.

## Example configuration

```yaml title="batect.yml"
containers:
  build-env:
    image: node:15.0.1
    volumes:
      - local: .
        container: /code
      - type: cache
        name: node_modules
        container: /code/node_modules
      - type: cache
        name: yarn_cache
        container: /root/.cache/yarn # Or .cache/yarn in home_directory if run as current user mode is enabled
    working_directory: /code
    enable_init_process: true
```

## Caching dependencies

:::tip
**tl;dr**: Mount a [cache](../../concepts/caches.md) into your container for the `node_modules` and `~/.cache/yarn` directories, otherwise you'll experience poor performance on macOS and Windows.
:::

Both NPM and Yarn download and store dependencies in the `node_modules` directory in your application's directory. Yarn also caches downloaded dependencies in `~/.cache/yarn`.
However, when running on macOS and Windows, Docker exhibits poor I/O performance for directories mounted from the macOS or Windows host, as discussed in the section on
[caches](../../concepts/caches.md).

The solution to this is to mount a [cache](../../concepts/caches.md) into your container for `node_modules` and `~/.cache/yarn`.

Note that you can't use `~` in the container path for a volume mount:

- If you're using [run as current user mode](../../concepts/run-as-current-user-mode.md), use the home directory you specified for [`home_directory`](../../reference/config/containers.md#run_as_current_user).

- If you're not using [run as current user mode](../../concepts/run-as-current-user-mode.md), use `/root` as the home directory, as the vast majority of containers
  default to the root user and use this as the root user's home directory.

## Issues with signals not being handled correctly

:::tip
**tl;dr**: If signals such as `SIGINT` (which is generated when you press Ctrl+C) aren't being handled correctly by your Node.js-based application,
enable [`enable_init_process`](../../reference/config/containers.md#enable_init_process) for that container
:::

Node.js does not behave correctly when it is running as process ID 1 (PID 1), which is what happens when running an application inside a container.
The most noticeable issue this causes is that applications do not respond correctly to signals such as `SIGINT` (which is generated when you press Ctrl+C).

The solution is to run another process (an 'init process') as PID 1, which then runs your application and handles and forwards signals to it.

Docker has a slimmed-down init process built in that is designed for just this scenario. You can enable it for a container in Batect by setting
[`enable_init_process`](../../reference/config/containers.md#enable_init_process) to `true`.

[This article](https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html) has a more detailed explanation of what is happening and why
an init process solves this problem.

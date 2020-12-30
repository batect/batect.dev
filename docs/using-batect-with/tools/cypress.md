---
title: Cypress
---

You can see an example of configuring and using Cypress for UI testing with Batect in the [Cypress sample project](https://github.com/batect/batect-sample-cypress).

Much of the advice on the [Node.js page](nodejs.md) also applies here.

## Chrome's shared memory usage

Chrome uses IPC to communicate between its various processes. If your page is particularly complex, this can require a lot of
shared memory (often referred to as `shm`), and if there isn't enough shared memory available, Chrome will simply crash.

By default, Docker will set a limit on shared memory of 64 MB, which usually isn't enough. You can increase this limit by setting
[`shm_size`](../../reference/config/containers.md#shm_size) on the container that Cypress runs in.

There's more information available in [this issue](https://github.com/cypress-io/cypress/issues/350#issuecomment-353572782) in the
Cypress repo. Note that setting `ipc` to `host` is not required if `shm_size` is set above its default.

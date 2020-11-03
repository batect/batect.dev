---
title: Improve performance
---

Unfortunately, using Docker does add some overhead in some scenarios. This guide provides guidance on a number of common problem areas:

- [Image build performance](#image-build-performance)
- [I/O performance](#io-performance)
- [Database schema migrations and test data setup](#database-schema-migrations-and-test-data-setup)
- [Shutdown / cleanup time](#shutdown--cleanup-time)

## Image build performance

If your container is using a build directory and Dockerfile rather than a pre-existing image, building this image can sometimes take quite a while.

If using a pre-built image is not an option, there are two things you can try to improve image build times:

- [Order build steps to take advantage of Docker's image build cache](#order-build-steps-to-take-advantage-of-dockers-image-build-cache)
- [Use BuildKit](#use-buildkit)

### Order build steps to take advantage of Docker's image build cache

When Docker is building an image, it executes each step in the Dockerfile in sequence. When it is safe to do so, Docker can
reuse the cached output of a previous image build for the current step. This can save a significant amount of time.

This caching behaviour is an important consideration when ordering commands in a Dockerfile, especially if it will be built many times.
If infrequently changing steps appear first, then their output can be cached and only the later steps need to be rebuilt, saving time.

For example, consider this Dockerfile:

```dockerfile title="Dockerfile"
FROM alpine:3.12.1
RUN mkdir -p /app
COPY my-app /app/my-app
RUN apk add --no-cache ruby
```

Every time `my-app` changes, Docker will need to run the `COPY` step as well as the `RUN apk add...` step. However, there's no need for the
steps to run in this order. If we swap the order of these two steps, then when `my-app` changes, the only step that needs to be rebuilt is the
`COPY` step:

```dockerfile title="Dockerfile" {3-4}
FROM alpine:3.12.1
RUN mkdir -p /app
RUN apk add --no-cache ruby
COPY my-app /app/my-app
```

### Use BuildKit

:::caution
BuildKit support in Batect is currently experimental. Some features may not work as expected.

Please [open an issue](https://github.com/batect/batect/issues) if you encounter any problems.
:::

[BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/) is a new image builder available in recent versions of Docker.
It offers significantly improved performance over the legacy image builder as well as some other new features.

You can enable BuildKit by setting the `DOCKER_BUILDKIT` environment variable to `1`. Alternatively, to enable BuildKit on a once-off basis, run
Batect with the `--enable-buildkit` flag, for example: `./batect --enable-buildkit build`.

You can further improve image build performance with BuildKit by providing image digests for base images. Providing image digests allows BuildKit
to skip checking if the base image is up-to-date. For example, instead of using `FROM alpine:3.12.1`, use
`FROM alpine:3.12.1@sha256:d7342993700f8cd7aba8496c2d0e57be0666e80b4c441925fc6f9361fa81d10e`.

## I/O performance

:::tip
**tl;dr**: If you're seeing slow build times on macOS or Windows, using Batect's [caches](../concepts/caches.md) as well as volume mount options such
as `cached` might help
:::

Docker requires features only found in the Linux kernel, and so on macOS and Windows, Docker Desktop runs a lightweight Linux virtual machine
to host Docker. However, while this works perfectly fine for most situations, there is some overhead involved in operations
that need to work across the host / virtual machine boundary, particularly when it comes to mounting files or directories into a container from the host.

While the throughput of mounts on macOS and Windows is generally comparable to native file access within a container, the latency
performing I/O operations such as opening a file handle can often be significant. This overhead is introduced because these need to cross from the Linux
VM hosting Docker to the host OS and back again.

This increased latency quickly accumulates, especially when many file operations are involved. This particularly affects languages such as JavaScript
and Golang that encourage distributing all dependencies as source code and breaking codebases into many small files: even a warm build with no source
code changes still requires the compiler to examine each dependency file to ensure that the cached build result is up-to-date.

There are two ways to improve the performance of file I/O when using Batect:

- Use [a Batect cache backed by a Docker volume](#cache-volumes) wherever possible
- Otherwise, use [the `cached` mount mode](#mounts-in-cached-mode)

### Cache volumes

The performance penalty of mounting a file or directory from the host machine does not apply to [Docker volumes](https://docs.docker.com/storage/volumes/),
as these remain entirely on the Linux VM hosting Docker. This makes them perfect for directories such as caches where persistence between task runs is required,
but easy access to their contents is not necessary.

Batect makes this simple to configure. In your container definition, add a mount to [`volumes`](../reference/config/containers.md#volumes) with `type: cache`.

For example, for a typical Node.js application, include the following in your configuration to cache the `node_modules` directory in a volume:

```yaml title="batect.yml"
containers:
  build-env:
    image: "node:13.8.0"
    volumes:
      - local: .
        container: /code
      - type: cache
        name: app-node-modules
        container: /code/node_modules
    working_directory: /code
```

Batect uses a [cache initialisation container](https://github.com/batect/batect-cache-init-image) to prepare volumes for use as caches. This process ensures that volumes
used as caches are readable by containers running with [run as current user mode](../concepts/run-as-current-user-mode.md) enabled, and that new caches are empty the first time they
are used.

:::tip
To make it easier to share caches between builds on ephemeral CI agents, you can instruct Batect to use directories instead of volumes, and then use these
directories as a starting point for subsequent builds. Run Batect with `--cache-type=directory` to enable this behaviour, then save and restore the
`.batect/caches` directory between builds.

This is only recommended on Linux CI agents, as using mounted directories instead of volumes has no performance impact on Linux.
:::

#### Windows containers

The performance penalty described above does not apply when mounting directories into Windows containers. Batect therefore always uses directory mounts for
caches on Windows containers, even if `--cache-type=volume` is specified on the command line.

### Mounts in `cached` mode

:::info
This section only applies to macOS-based hosts, and is only supported by Docker version 17.04 and higher.
Enabling `cached` mode is harmless for other host operating systems.
:::

For situations where a cache is not appropriate (eg. mounting your code from the host into a build environment), specifying the `cached` volume mount option
can result in significant performance improvements.

Before you use this option in another context, you should consult the [documentation](https://docs.docker.com/docker-for-mac/osxfs-caching/) to understand the implications of it.

For example, instead of defining your container like this:

```yaml title="batect.yml"
containers:
  build-env:
    image: "ruby:2.4.3"
    volumes:
      - local: .
        container: /code
    working_directory: /code
```

use this:

```yaml title="batect.yml"
containers:
  build-env:
    image: "ruby:2.4.3"
    volumes:
      - local: .
        container: /code
        options: cached # This enables 'cached' mode for the /code mount
    working_directory: /code
```

Setting this option will not affect Linux or Windows hosts, so it's safe to commit and share this in a project where some developers use
macOS and others use Linux or Windows.

## Database schema migrations and test data setup

:::tip
**tl;dr**: Try to do as much work as possible at image build time, rather than doing it every time the container starts
:::

A significant amount of time during integration or journey testing with a database can be taken up by preparing the database for
use. Setting up the database schema (usually with some kind of migrations system) and adding the initial test data can take quite some time,
especially as the application evolves over time.

One way to address this is to bake the schema and test data into the Docker image used for the database, so that this setup cost only
has to be paid when building the image or when the setup changes, rather than on every test run. The exact method for doing this will
vary depending on the database system you're using, but the general steps that would go in your Dockerfile are:

1. Copy schema and test data scripts into container
2. Temporarily start database daemon
3. Run schema and data scripts against database instance
4. Shut down database daemon

## Shutdown / cleanup time

:::tip
**tl;dr**: Make sure signals such as `SIGTERM` and `SIGKILL` are being passed to the main process
:::

If you notice that post-task cleanup for a container is taking longer than expected, and that container starts the main process from a
shell script, make sure that signals such as `SIGTERM` and `SIGKILL` are being forwarded to the process.

Otherwise, if these signals are not forwarded correctly, Docker will wait 10 seconds for the application to respond to the signal before
timing out and terminating the process.

For example, instead of using:

```bash
#! /usr/bin/env bash

/app/my-really-cool-app --do-stuff
```

use this:

```bash
#! /usr/bin/env bash

exec /app/my-really-cool-app --do-stuff
```

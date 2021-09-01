---
title: Containers
---

:::note
This page reflects the options available in the [most recent version](https://github.com/batect/batect/releases/latest)
of Batect.
:::

A [container](../../concepts/containers.md) is the environment in which a command is run. It is based on a Docker image, along with
other configuration such as environment variables.

## Names

Container names must be valid Docker references:

- they must contain only:

  - lowercase letters
  - digits
  - dashes (`-`)
  - single consecutive periods (`.`)
  - one or two consecutive underscores (`_`)

- they must not start or end with dashes, periods or underscores

## Definition

Each container definition is made up of the following fields:

- [`additional_hostnames`](#additional_hostnames): other hostnames to associate with the container, in addition to the container's name
- [`additional_hosts`](#additional_hosts): extra entries to add to `/etc/hosts` inside the container
- [`build_args`](#build_args): list of build args to use when building the image in `build_directory`
- [`build_directory`](#build_directory): path to a directory containing a Dockerfile to build and use for this container.
- [`build_target`](#build_target): Dockerfile stage name to build and use for this container.
- [`capabilities_to_add`](#capabilities_to_add-and-capabilities_to_drop): additional capabilities to grant to the container
- [`capabilities_to_drop`](#capabilities_to_add-and-capabilities_to_drop): additional capabilities to remove from the container
- [`command`](#command): command to run when the container starts
- [`dependencies`](#dependencies): other containers to start before starting this container
- [`devices`](#devices): device mounts to create for the container
- [`dockerfile`](#dockerfile): Dockerfile to use when building the image in `build_directory`
- [`enable_init_process`](#enable_init_process): enable Docker's init process for the container
- [`entrypoint`](#entrypoint): entrypoint to use to run the container's command
- [`environment`](#environment): environment variables for the container
- [`health_check`](#health_check): health check configuration for the container
- [`image`](#image): image to use for this container.
- [`image_pull_policy`](#image_pull_policy): when to pull the image used by this container
- [`log_driver`](#log_driver): Docker log driver to use when running the container
- [`log_options`](#log_options): additional options for the log driver in use
- [`ports`](#ports): ports to expose from the container to the host machine
- [`privileged`](#privileged): enable privileged mode for the container
- [`run_as_current_user`](#run_as_current_user): configuration for ['run as current user' mode](../../concepts/run-as-current-user-mode.md)
- [`setup_commands`](#setup_commands): commands to run inside the container after it has become healthy but before dependent containers start
- [`shm_size`](#shm_size): size of `/dev/shm` (shared memory for IPC) for the container
- [`volumes`](#volumes): volume mounts to create for the container
- [`working_directory`](#working_directory): working directory for the container's command

One of [`build_directory`](#build_directory) or [`image`](#image) is required.

### `additional_hostnames`

List of hostnames to associate with this container, in addition to the default hostname (the name of the container).

For example, `my-container` will be reachable by other containers running as part of the same task at both `my-container` and `other-name` with the following configuration:

```yaml title="batect.yml"
containers:
  my-container:
    additional_hostnames:
      - other-name
```

### `additional_hosts`

Additional hostnames to add to `/etc/hosts` in the container. Equivalent to `--add-host` option for `docker run`.

For example, to configure processes inside `my-container` to resolve `database.example.com` to `1.2.3.4`:

```yaml title="batect.yml"
containers:
  my-container:
    additional_hosts:
      database.example.com: 1.2.3.4
```

### `build_args`

List of build args (in `name: value` format) to use when building the image in [`build_directory`](#build_directory). Values can be [expressions](expressions.md).

Each build arg must be defined in the Dockerfile with an `ARG` instruction otherwise the value provided will have no effect.

For example, to set the `message` build arg to `hello`:

```yaml title="batect.yml"
containers:
  my-container:
    build_args:
      message: hello
```

:::caution
Use caution when using build args for secret values. Build arg values can be revealed by anyone with a copy of the image with the `docker history` command.
:::

### `build_directory`

Path (relative to the configuration file's directory) to a directory containing a Dockerfile to build and use as an image for this container.
One of `image` or `build_directory` is required.

Value can be an [expression](expressions.md).

On Windows, `build_directory` can use either Windows-style (`path\to\thing`) or Unix-style (`path/to/thing`) paths, but for compatibility
with users running on other operating systems, using Unix-style paths is recommended.

The image can be overridden when running a task with [`--override-image`](../cli.mdx#--override-image).

The [Docker build cache](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#leverage-build-cache) is used during the build process,
so if the image definition has not changed since the last build, the image will not be rebuilt, saving time.

For example, running the container `my_container` from the following configuration will first build the Dockerfile in the `.batect/my-container` directory, then run the resulting image:

```yaml title="batect.yml"
containers:
  my-container:
    build_directory: .batect/my-container
```

### `build_target`

[Dockerfile stage name](https://docs.docker.com/develop/develop-images/multistage-build/#name-your-build-stages) to build and use for this container.

Only supported when building an image with [`build_directory`](#build_directory).

If not specified, Batect will build and use the default stage.

For example, running the container `my_container` from the following configuration will first build the `my-stage` stage from the Dockerfile in the
`.batect/my-container` directory, then run the resulting image:

```yaml title="batect.yml"
containers:
  my-container:
    build_directory: .batect/my-container
    build_stage: my-stage
```

### `capabilities_to_add` and `capabilities_to_drop`

List of [capabilities](https://man7.org/linux/man-pages/man7/capabilities.7.html) to add or drop for the container.

For example:

```yaml title="batect.yml"
containers:
  my-container:
    capabilities_to_add:
      - CAP_SYS_ADMIN
    capabilities_to_drop:
      - CAP_KILL
```

### `command`

Command to run when the container starts.

If not provided, the default command for the image will be run.

Both of these can be overridden for an individual task by specifying a [`command` at the task level](tasks.md#run).

For example, running the container `my-container` from the following configuration will run the command `echo 'Hello world'`, and not the default command specified in the `my-image` image:

```yaml title="batect.yml"
containers:
  my-container:
    image: my-image
    command: echo 'Hello world'
```

:::note
This command is passed to the image's `ENTRYPOINT`, just like it would when using `docker run <image> <command>` directly.

This means that if the entrypoint is not set or is not a shell, standard shell syntax features like `$MY_ENVIRONMENT_VARIABLE` and `&&` might not work.

See the Docker docs for [`CMD`](https://docs.docker.com/engine/reference/builder/#cmd) and
[`ENTRYPOINT`](https://docs.docker.com/engine/reference/builder/#entrypoint) for more details.

If you would like to use shell syntax features in your command, you have four options:

1. Create a shell script and invoke that instead of specifying the command directly.

2. Wrap your command in a shell invocation.

   For example, if your command is `echo hello && echo world`, set `command` to `sh -c 'echo hello && echo world'`.

3. Set the entrypoint in the image to a shell. For example:

   ```dockerfile title="Dockerfile"
   ENTRYPOINT ["/bin/sh", "-c"]
   ```

4. Set the [entrypoint](#entrypoint) for the container to a shell. For example:

   ```yaml title="batect.yml"
   containers:
     container-1:
       command: "'echo hello && echo world'"
       entrypoint: /bin/sh -c
   ```

   (the `command` above is enclosed in single quotes so that whole command is treated as a single argument when passed to `sh`, and then enclosed in double quotes so that YAML preserves the single quotes)

Note that for both options 3 and 4, you must quote the command so that it is passed to `sh -c` as a single argument (we want the final command line to be `sh -c 'echo hello && echo world'`, not
`sh -c echo hello && echo world`).
:::

### `dependencies`

List of other containers that should be started and healthy before starting this container.

If a dependency's image does not contain a [health check](https://docs.docker.com/engine/reference/builder/#healthcheck), then as soon as it has started,
it is considered to be healthy.

See [this page](../../how-to/wait-for-dependencies.md) for more information on how to ensure dependencies are ready before starting containers that
depend on them.

For example, running the container `application` from the following configuration will first run the `database` container and [wait for it to become healthy](../../how-to/wait-for-dependencies.md)
before starting the `application` container:

```yaml title="batect.yml"
containers:
  application:
    build_directory: .batect/application
    dependencies:
      - database

  database:
    build_directory: .batect/database
```

### `devices`

List of device mounts to create for the container.

Two formats are supported:

- `local:container` or `local:container:options` format

- An expanded format:
  ```yaml title="batect.yml"
  containers:
    my-container:
      ...
      devices:
      # This is equivalent to /dev/sda:/dev/disk:r
      - local: /dev/sda
        container: /dev/disk
        options: r
  ```

Note that the `local` device mounts will be different for Windows and Unix-like hosts. See the [Docker guide for adding host devices to containers](https://docs.docker.com/engine/reference/commandline/run/#add-host-device-to-container---device) for more information.

### `dockerfile`

Dockerfile (relative to [`build_directory`](#build_directory)) to use when building the image in [`build_directory`](#build_directory). Defaults to `Dockerfile` if not set.

The Dockerfile must be within [`build_directory`](#build_directory).

`dockerfile` must always be specified with Unix-style (`path/to/thing`) paths, even when running on Windows.

For example, running the container `my_container` from the following configuration will build the image given by the Dockerfile stored at `.batect/my-container/my-custom-Dockerfile`:

```yaml title="batect.yml"
containers:
  my-container:
    build_directory: .batect/my-container
    dockerfile: my-custom-Dockerfile
```

### `enable_init_process`

Set to `true` to pass the [`--init`](https://docs.docker.com/engine/reference/run/#specify-an-init-process) flag when running the container.
Defaults to `false`.

This creates the container with a simple PID 1 process to handle the responsibilities of the init system, which is required for some applications to behave correctly.

[Read this article](https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html) to understand more about the behaviour
of different processes running as PID 1 and why this flag was introduced.

For example, running the container `build-env` from the following configuration will launch a container that uses the `node:10.10.0-alpine` image with Docker's default init process as PID 1:

```yaml title="batect.yml"
containers:
  build-env:
    image: node:10.10.0-alpine
    enable_init_process: true
```

### `entrypoint`

Entrypoint to use to run [command](#command) or the image's default command if `command` is not provided.

If not provided, the default entrypoint for the image will be used.

Both of these can be overridden for an individual task by specifying an [`entrypoint` at the task level](tasks.md#entrypoint).

See the Docker docs for [`CMD`](https://docs.docker.com/engine/reference/builder/#cmd) and
[`ENTRYPOINT`](https://docs.docker.com/engine/reference/builder/#entrypoint) for more information on how the entrypoint is used.
Batect will always convert the entrypoint provided here to the exec form when passed to Docker.

For example, the container `my-container` from the following configuration will use `sh -c` as its entrypoint and ignore the default entrypoint set in `my-image`:

```yaml title="batect.yml"
containers:
  my-container:
    image: my-image
    entrypoint: sh -c
```

### `environment`

List of environment variables (in `name: value` format) for the container.

Values can be [expressions](expressions.md).

Can be extended for a task's main container with [`run.environment`](tasks.md#environment) or dependencies with
[`customise.<container>.environment`](tasks.md#environment-1).

#### Example

Let's assume we have the following configuration:

```yaml title="batect.yml"
containers:
  build-env:
    image: ruby:2.4.3
    environment:
      COUNTRY: Australia
      SUPER_SECRET_VALUE: $SECRET_PASSWORD
      OPTIMISATION_LEVEL: ${HOST_OPTIMISATION_LEVEL:-none}
```

Running the container `build-env` will launch a container that uses the `ruby:2.4.3` image with the following environment variables:

- The environment variable `COUNTRY` will have value `Australia`.

- The environment variable `SUPER_SECRET_VALUE` will have the value of the `SECRET_PASSWORD` environment variable on
  the host. (So, for example, if `SECRET_PASSWORD` is `abc123` on the host, then `SUPER_SECRET_VALUE` will have the value `abc123` in the container.)

  If `SECRET_PASSWORD` is not set on the host, Batect will show an error message and not start the task.

- The environment variable `OPTIMISATION_LEVEL` will have the value of the `HOST_OPTIMISATION_LEVEL` environment variable on the host.

  If `HOST_OPTIMISATION_LEVEL` is not set on the host, then `OPTIMISATION_LEVEL` will have the value `none` in the container.

#### `TERM`

The `TERM` environment variable, if set on the host, is always automatically passed through to the container. This ensures that features such as
coloured output continue to work correctly inside the container.

#### Proxy-related environment variables

Proxy-related environment variables, if set on the host, are passed through to the container at build and run time, but are not used for image pulls.

If a proxy-related environment variable is defined on the container's configuration, it takes precedence over the host-provided value.

See [this page](../../how-to/proxies.mdx) for more information on using Batect with proxies.

### `health_check`

Overrides the [health check configuration](https://docs.docker.com/engine/reference/builder/#healthcheck) specified in the image:

#### `command`

The command to run to check the health of the container.

If this command exits with code 0, the container is considered healthy, otherwise the container is considered unhealthy.

#### `retries`

The number of times to perform the health check before considering the container unhealthy.

#### `interval`

The interval between runs of the health check.

Accepts values such as `2s` (two seconds) or `1m` (one minute).

#### `start_period`

The time to wait before failing health checks count against the retry count. During this period, the health check still runs,
and if the check succeeds during this time, the container is immediately considered healthy.

Accepts values such as `2s` (two seconds) or `1m` (one minute).

#### `timeout`

The time to wait before timing out a single health check command invocation.

Accepts values such as `2s` (two seconds) or `1m` (one minute).

#### Example

The following configuration uses a fictional `is-healthy` command every two seconds to determine if the container is healthy.
After an initial three second waiting period, the container will be declared unhealthy if it fails the health check five more times.

A single invocation of `is-healthy` will also be considered failed if it does not return within one second.

```yaml title="batect.yml"
containers:
  my-container:
    health_check:
      command: is-healthy localhost:8080
      interval: 2s
      retries: 5
      start_period: 3s
      timeout: 1s
```

### `image`

Image name (in standard Docker image reference format) to use for this container. One of `image` or `build_directory` is required.

If the image has not already been pulled, Batect will pull it before starting the container.

The image can be overridden from the command line when running a task with [`--override-image`](../cli.mdx#--override-image).

For example, the container `my-container` from the following configuration will use the `ruby:2.4.3` image:

```yaml title="batect.yml"
containers:
  my-container:
    image: ruby:2.4.3
```

:::tip
It is highly recommended that you specify a specific image version, and not use `latest`, to ensure that the same image is used
everywhere. For example, use `alpine:3.7`, not `alpine` or `alpine:latest`.
:::

### `image_pull_policy`

Controls when to pull the image used by this container.

If the image is specified as [`image`](#image), this policy controls the behaviour for pulling `image`. If the image is built from
a [`build_directory`](#build_directory), this policy controls the behaviour for pulling any base images.

Valid options are:

- `IfNotPresent` (default): pull the image / base image(s) for the container only if an image with the same tag has not already been pulled
- `Always`: always attempt to pull the image / base image(s) every time the container is started

For example, the container `my-container` from the following configuration will use the `IfNotPresent` image pull policy:

```yaml title="batect.yml"
containers:
  my-container:
    image_pull_policy: IfNotPresent
```

:::tip
It is highly recommended that you use `IfNotPresent`. Using `Always` can incur a significant performance penalty.
:::

### `log_driver`

The Docker log driver to use when running the container.

Defaults to `json-file` if not set.

A full list of built-in log drivers is available in [the logging section of Docker documentation](https://docs.docker.com/config/containers/logging/configure/#supported-logging-drivers),
and [logging plugins](https://docs.docker.com/config/containers/logging/plugins/) can be used as well.

Options for the log driver can be provided with [`log_options`](#log_options).

For example, the container `my-container` from the following configuration will use the `syslog` log driver:

```yaml title="batect.yml"
containers:
  my-container:
    log_driver: syslog
```

:::warning
If you are running Docker 19.03 or earlier, some log drivers do not support streaming container output to the console, as described in
[the limitations section of Docker's logging documentation](https://docs.docker.com/config/containers/logging/configure/#limitations-of-logging-drivers).

If the selected log driver does not support streaming container output to the console, you will see error messages similar to
`Error attaching: configured logging driver does not support reading` in Batect's output. This does not affect the execution of the task, which
will run to completion as per normal.
:::

### `log_options`

Options to provide to the Docker log driver used when running the container.

For example, to set [the tag used to identify the container in logs](https://docs.docker.com/config/containers/logging/log_tags/):

```yaml title="batect.yml"
containers:
  my-container:
    log_options:
      tag: "my-container"
```

The options available for each log driver are described in the Docker documentation for that log driver, such as
[this page](https://docs.docker.com/config/containers/logging/json-file/) for the `json-file` driver.

### `ports`

List of ports to make available to the host machine.

Three formats are supported:

- `local:container` or `local:container/protocol` format

  For example, `1234:5678` or `1234:5678/tcp` will make TCP port 5678 inside the container available on the host machine at TCP port 1234, and
  `1234:5678/udp` will make UDP port 5678 inside the container available on the host machine at UDP port 1234.

- `local_from-local_to:container_from:container-to` or `local_from-local_to:container_from:container-to/protocol` format

  For example, `1000-1001:2025-2026` or `1000-1001:2025-2026/tcp` will make TCP port 2025 inside the container available
  on the host machine at TCP port 1000, and TCP port 2026 inside the container available on the host machine at TCP port 1001.

- An expanded format:
  ```yaml title="batect.yml"
  containers:
    my-container:
      ...
      ports:
        # This is equivalent to 1234:5678 or 1234:5678/tcp
        - local: 1234
          container: 5678
        # This is equivalent to 3000:4000/udp
        - local: 3000
          container: 4000
          protocol: udp
        # This is equivalent to 1000-1001:2025-2026 or 1000-1001:2025-2026/tcp
        - local: 1000-1001
          container: 2025-2026
        # This is equivalent to 5000-5001:6025-6026/udp
        - local: 5000-5001
          container: 6025-6026
          protocol: udp
  ```

All protocols supported by Docker are supported. The default protocol is TCP if none is provided.

The port does not need to have a corresponding `EXPOSE` instruction in the Dockerfile.

Can be extended for a task's main container with [`run.ports`](tasks.md#ports) or dependencies with
[`customise.<container>.ports`](tasks.md#ports-1).

For example, the `my-container` container in the following configuration allows accessing port 5678 from the container on port 1234 on the host machine:

```yaml title="batect.yml"
container:
  my-container:
    ports:
      - 1234:5678
      # or
      - local: 1234
        container: 5678
```

:::tip
Exposing ports is only required if you need to access the container from the host machine.

Any container started as part of a task will be able to access any port on any other container at the address `container_name:container_port`, even if that port
is not listed in `ports`.

For example, if a process running in the `http-server` container listens on port 2000, any other container in the task can access that at `http-server:2000`
without port 2000 being listed in `ports` (or an `EXPOSE` Dockerfile instruction).
:::

### `privileged`

Set to `true` to run the container in [privileged mode](https://docs.docker.com/engine/reference/commandline/run/#full-container-capabilities---privileged). Defaults to `false`.

See also [`capabilities_to_add` and `capabilities_to_drop`](#capabilities_to_add-and-capabilities_to_drop).

For example, the following configuration runs the `my-container` container in privileged mode:

```yaml title="batect.yml"
containers:
  my-container:
    privileged: true
```

### `run_as_current_user`

Run the container with the same UID and GID as the user running Batect (rather than the user the Docker daemon runs as, which is root
on Linux). This means that any files created by the container will be owned by the user running Batect, rather than root.

This is really only useful on Linux. On macOS, the Docker daemon runs as the currently logged-in user and so any files created in the container are owned
by that user, so this is less of an issue. However, for consistency, the same configuration changes are made on both Linux and macOS.

See [this page](../../how-to/build-artefacts-owned-by-root.md) for more information on the effects of this option and why it is necessary.

`run_as_current_user` has the following options:

#### `enabled`

Set to `true` to enable 'run as current user' mode. Defaults to `false`.

#### `home_directory`

Directory to use as home directory for user inside container.

Required if `enabled` is `true`, not allowed if `enabled` is `false`.

This directory is automatically created by Batect with the correct owner and group.

:::warning
If the directory given by `home_directory` already exists inside the image for this container, it is overwritten.
:::

#### Example

```yaml title="batect.yml"
containers:
  my-container:
    image: ruby:2.4.3
    run_as_current_user:
      enabled: true
      home_directory: /home/container-user
```

### `setup_commands`

List of commands to run inside the container after it has become healthy but before dependent containers start.

See [the task lifecycle](../../concepts/task-lifecycle.mdx) for more information on the effects of this option.

:::tip
It is recommended that you try to include any setup work in your image's Dockerfile wherever possible (and not use setup commands). Setup commands must be
run every time the container starts whereas commands included in your image's Dockerfile only run when the image needs to be built, reducing the time taken
for tasks to start.
:::

Each setup command has the following options:

#### `command`

The command to run. **Required.**

This command is run in a similar way to the container's [`command`](#command), so the same limitations apply to using shell syntax such as `&&`.

#### `working_directory`

The working directory to use for the command.

If no working directory is provided, [`working_directory`](#working_directory) is used if it is set, otherwise the image's default working directory is used.
If this container is used as the task container and the task overrides the default working directory, that override is ignored when running setup commands.

The command will inherit the same environment variables as the container's `command` (including any specified on the task if this is the task container), runs as the
same [user and group](#run_as_current_user) as the container's `command` and inherits the same settings for [privileged status](#privileged) and
[capabilities](#capabilities_to_add-and-capabilities_to_drop).

#### Example

Let's assume we have the following configuration:

```yaml title="batect.yml"
containers:
  database:
    setup_commands:
      - command: ./apply-migrations.sh

  application:
    dependencies:
      - database
```

Running the container `application` will first build or pull the images for both the `database` and `application` containers.

Once the image for `database` is ready, `database` will start and launch the command specified in the Dockerfile, then Batect will wait for the container to report as healthy.
Once `database` reports as healthy, it will run `./apply-migrations.sh` and wait for it to finish before then starting `application`.

### `shm_size`

Size of `/dev/shm` (shared memory for IPC) for the container.

If not set, uses Docker's default value, which is currently 64 MB.

Accepts values such as `2000` (2000 bytes), `3k` (3 KB), `5m` (5 MB) or `1g` (1 GB).

### `volumes`

List of volume mounts to create for the container.

Both local mounts (mounting a directory on the host into a container) and [caches](../../concepts/caches.md) are supported:

#### Local mounts

Two formats are supported:

- `local:container` or `local:container:options` format

- An expanded format:

  ```yaml title="batect.yml"
  containers:
    my-container:
      ...
      volumes:
        # This is equivalent to .:/code:cached
        - local: .
          container: /code
          options: cached
  ```

In both formats, the following fields are supported:

- `local`: path to the local file or directory to mount. Can be an [expression](expressions.md) when using the expanded format. Required.

  Relative paths will be resolved relative to the current configuration file's directory.

  On Windows, the local path can use either Windows-style (`path\to\thing`) or Unix-style (`path/to/thing`) paths, but for compatibility
  with users running on other operating systems, using Unix-style paths is recommended.

- `container`: path to mount the local file or directory at inside the container. Required.

- `options`: standard Docker mount options (such as `ro` for read-only). Optional.

Using `options: cached` may improve performance when running on macOS and Windows hosts - see [this page](../../how-to/performance.md#io-performance) for further explanation.

#### Caches

[Caches](../../concepts/caches.md) provide persistence between task runs without the performance overhead of mounting a directory from the host into the container.

They are perfect for directories such as `node_modules` which contain downloaded dependencies that can safely be reused for each task run.

The format for a cache mount is:

```yaml title="batect.yml"
containers:
  my-container:
    ...
    volumes:
      - type: cache
        name: node-modules
        container: /code/node_modules
```

The following fields are supported:

- `type`: must be set to `cache`. Required.
- `name`: name of the cache, must be a valid Docker volume name. The same name can be used to share a cache between multiple containers. Required.
- `container`: path to mount the cache directory at inside the container. Required.
- `options`: standard Docker mount options (such as `ro` for read-only). Optional.

### `working_directory`

Working directory to start the container in.

If not provided, the default working directory for the image will be used.

Can be overridden for a task's main container with [`run.working_directory`](tasks.md#working_directory) or dependencies with
[`customise.<container>.working_directory`](tasks.md#working_directory-1).

For example, the container `my-container` in the following configuration will start with the working directory set to `/somewhere`:

```yaml title="batect.yml"
containers:
  my-container:
    working_directory: /somewhere
```

## Equivalent options in other tools

Many of the fields above have equivalent options in other tools.

### Docker CLI

| Batect container field                                                  | Docker CLI option                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------------ |
| [`additional_hostnames`](#additional_hostnames)                         | `--network-alias` to `docker run`                      |
| [`additional_hosts`](#additional_hosts)                                 | `--add-host` to `docker run`                           |
| [`build_args`](#build_args)                                             | `--build-arg` to `docker build`                        |
| [`build_directory`](#build_directory)                                   | argument to `docker build`                             |
| [`build_target`](#build_target)                                         | `--target` to `docker build`                           |
| [`capabilities_to_add`](#capabilities_to_add-and-capabilities_to_drop)  | `--cap-add` to `docker run`                            |
| [`capabilities_to_drop`](#capabilities_to_add-and-capabilities_to_drop) | `--cap-drop` to `docker run`                           |
| [`command`](#command)                                                   | argument to `docker run`                               |
| [`dependencies`](#dependencies)                                         | (none)                                                 |
| [`devices`](#devices)                                                   | `--device` to `docker run`                             |
| [`dockerfile`](#dockerfile)                                             | `--file` to `docker build`                             |
| [`enable_init_process`](#enable_init_process)                           | `--init` to `docker run`                               |
| [`entrypoint`](#entrypoint)                                             | `--entrypoint` to `docker run`                         |
| [`environment`](#environment)                                           | `--env` to `docker run`                                |
| [`health_check.command`](#command-1)                                    | `--health-cmd` to `docker run`                         |
| [`health_check.interval`](#interval)                                    | `--health-interval` to `docker run`                    |
| [`health_check.retries`](#retries)                                      | `--health-retries` to `docker run`                     |
| [`health_check.start_period`](#start_period)                            | `--health-start-period` to `docker run`                |
| [`health_check.timeout`](#timeout)                                      | `--health-timeout` to `docker run`                     |
| [`image`](#image)                                                       | argument to `docker run`                               |
| [`image_pull_policy`](#image_pull_policy)                               | `--pull` to `docker build` or re-running `docker pull` |
| [`log_driver`](#log_driver)                                             | `--log-driver` to `docker run`                         |
| [`log_options`](#log_options)                                           | `--log-opt` to `docker run`                            |
| [`ports`](#ports)                                                       | `--publish` to `docker run`                            |
| [`privileged`](#privileged)                                             | `--privileged` to `docker run`                         |
| [`run_as_current_user`](#run_as_current_user)                           | (none)                                                 |
| [`setup_commands`](#setup_commands)                                     | (none)                                                 |
| [`shm_size`](#shm_size)                                                 | `--shm-size` to `docker run`                           |
| [`volumes`](#volumes)                                                   | `--volume` to `docker run`                             |
| [`working_directory`](#working_directory)                               | `--workdir` to `docker run`                            |

### Docker Compose

| Batect container field                                                  | Docker Compose field             |
| ----------------------------------------------------------------------- | -------------------------------- |
| [`additional_hostnames`](#additional_hostnames)                         | `extra_hosts`                    |
| [`additional_hosts`](#additional_hosts)                                 | `networks.aliases`               |
| [`build_args`](#build_args)                                             | `build.args`                     |
| [`build_directory`](#build_directory)                                   | `build` or `build.context`       |
| [`build_target`](#build_target)                                         | `build.target`                   |
| [`capabilities_to_add`](#capabilities_to_add-and-capabilities_to_drop)  | `cap_add`                        |
| [`capabilities_to_drop`](#capabilities_to_add-and-capabilities_to_drop) | `cap_drop`                       |
| [`command`](#command)                                                   | `command`                        |
| [`dependencies`](#dependencies)                                         | `depends_on` (behaviour differs) |
| [`devices`](#devices)                                                   | `devices`                        |
| [`dockerfile`](#dockerfile)                                             | `build.dockerfile`               |
| [`enable_init_process`](#enable_init_process)                           | `init`                           |
| [`entrypoint`](#entrypoint)                                             | `entrypoint`                     |
| [`environment`](#environment)                                           | `environment`                    |
| [`health_check.command`](#command-1)                                    | `healthcheck.test`               |
| [`health_check.interval`](#interval)                                    | `healthcheck.interval`           |
| [`health_check.retries`](#retries)                                      | `healthcheck.retries`            |
| [`health_check.start_period`](#start_period)                            | `healthcheck.start_period`       |
| [`health_check.timeout`](#timeout)                                      | `healthcheck.timeout`            |
| [`image`](#image)                                                       | `image`                          |
| [`image_pull_policy`](#image_pull_policy)                               | (none)                           |
| [`log_driver`](#log_driver)                                             | `logging.driver`                 |
| [`log_options`](#log_options)                                           | `logging.options`                |
| [`ports`](#ports)                                                       | `ports`                          |
| [`privileged`](#privileged)                                             | `privileged`                     |
| [`run_as_current_user`](#run_as_current_user)                           | (none)                           |
| [`setup_commands`](#setup_commands)                                     | (none)                           |
| [`shm_size`](#shm_size)                                                 | `shm_size`                       |
| [`volumes`](#volumes)                                                   | `volumes`                        |
| [`working_directory`](#working_directory)                               | `working_dir`                    |

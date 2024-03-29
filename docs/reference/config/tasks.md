---
title: Tasks
---

:::note
This page reflects the options available in the [most recent version](https://github.com/batect/batect/releases/latest)
of Batect.
:::

[Tasks](../../concepts/tasks.md) are the smallest unit of work in Batect.
They are an operation you can do: compiling your application, running the tests, running a linter or deploying your application.

## Names

Task names must meet the following requirements:

- they must contain only:

  - uppercase or lowercase letters
  - digits
  - dashes (`-`)
  - periods (`.`)
  - underscores (`_`)
  - colons (`:`)

- they must start with a letter or digit

- they must end with a letter or digit

## Definition

Each task definition is made up of the following fields:

- [`customise`](#customise)
- [`dependencies`](#dependencies)
- [`description`](#description)
- [`group`](#group)
- [`prerequisites`](#prerequisites)
- [`run`](#run)

At least one of [`run`](#run) or [`prerequisites`](#prerequisites) is required.

### `run`

Specifies what to do when this task starts.

If `run` is not provided, then `prerequisites` is required and the tasks listed in [`prerequisites`](#prerequisites) are run to completion before considering this task complete.

`run` is made up of the following fields:

- [`container`](#container)
- [`command`](#command)
- [`entrypoint`](#entrypoint)
- [`environment`](#environment)
- [`ports`](#ports)
- [`working_directory`](#working_directory)

#### `container`

[Container](containers.md) to run for this task. **Required.**

#### `command`

Command to run for this task.

Overrides any [command](containers.md#command) specified on the container definition and the image's default command. If no command is provided here,
[the command specified on the container definition](containers.md#command) is used if there is one, otherwise the image's default command is used.

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

#### `entrypoint`

Entrypoint to use to run the command.

Overrides any [entrypoint](containers.md#entrypoint) specified on the container definition and the image's default entrypoint. If no entrypoint is provided here,
[the entrypoint specified on the container definition](containers.md#entrypoint) is used if there is one, otherwise the image's default entrypoint is used.

Applies to whichever command takes precedence, whether that is the [command specified on this task](#command), the [command specified on the container](containers.md#command),
or the image's default command.

#### `environment`

List of environment variables (in `name: value` format) to pass to the container, in addition to those defined on the container itself.

If a variable is specified both here and on the container itself, the value given here will override the value defined on the container.

Values can be [expressions](expressions.md).

#### `ports`

List of port mappings to create for the container, in addition to those defined on the container itself.

Behaves identically to [specifying a port mapping directly on the container](containers.md#ports), and supports the same syntax.

#### `working_directory`

Working directory to use for this task's container.

Overrides any working directory on the container definition and the image's default working directory. If no working directory is provided here,
[the working directory specified on the container definition](containers.md#working_directory) is used if there is one, otherwise the image's default
working directory is used.

### `prerequisites`

List of other tasks that should be run to completion before running this task. Names are case-sensitive.

If a prerequisite task finishes with a non-zero exit code, then neither this task nor any other prerequisites will be run.

The tasks are run in the same order that they are declared in, unless reordering is required to satisfy the prerequisites of this task's prerequisites. If a
task is listed explicitly and also matches a wildcard, the first occurrence of the task is used.

Passing the [`--skip-prerequisites`](../cli.mdx#--skip-prerequisites) command line flag skips all defined prerequisites and runs only the task specified on the command line.

#### Wildcards

Prerequisite names can include wildcards, denoted by `*`. For example, rather than listing `lint:bar` and `lint:foo`, you can give just `lint:*`, and Batect will automatically run both `lint:bar` and
`lint:foo`.

A single `*` matches zero or more characters. For example, giving `lint:*` as a prerequisite would match the tasks `lint:a`, `lint:foo` and `lint:`.

To avoid YAML syntax issues with `*` characters, it's recommended you enclose names containing wildcards in quotes (eg. use `"lint:*"` rather than `lint:*`).

If a wildcard matches multiple tasks, the tasks are returned in alphabetic order. If a wildcard does not match any tasks, no error is raised.

### `customise`

Customisations to apply to containers started as part of this task.

Customisations can modify [the working directory](#working_directory-1) used by a container, add or override [environment variables](#environment-1),
or expose additional [ports](#ports-1).

Customisations can apply to containers listed as a dependency [directly on the task](#dependencies) or [on another container](containers.md#dependencies).

Customisations cannot be applied to the main task container specified with [`container`](#container). Use the corresponding fields on [`run`](#run) instead.

Customisations do not apply to containers started as part of prerequisite tasks.

#### Example

In the example below, running the `build` task will start both `main-container` and `container-a`. `container-a` will run with the following configuration:

- [Working directory](#working_directory-1): `/customised`

- [Exposed ports](#ports-1): both `1000:2000` and `3000:4000`

- [Environment variables](#environment-1):
  - `CONTAINER_VAR`: `set on container`
  - `OVERRIDDEN_VAR`: `overridden value from task`
  - `NEW_VAR`: `new value from task`

```yaml title="batect.yml"
containers:
  main-container:
    image: ...

  container-a:
    image: ...
    environment:
      CONTAINER_VAR: set on container
      OVERRIDDEN_VAR: won't be used
    working_directory: /wont-be-used
    ports:
      - 1000:2000

tasks:
  build:
    dependencies:
      - container-a
    run:
      container: build-env
    customise:
      container-a:
        working_directory: /customised
        environment:
          OVERRIDDEN_VAR: overridden value from task
          NEW_VAR: new value from task
        ports:
          - 3000:4000
```

#### `environment`

List of environment variables (in `name: value` format) to pass to the container, in addition to those defined on the container itself.

If a variable is specified both here and on the container itself, the value given here will override the value defined on the container.

Values can be [expressions](expressions.md).

#### `ports`

List of port mappings to create for the container, in addition to those defined on the container itself.

Behaves identically to [specifying a port mapping directly on the container](containers.md#ports), and supports the same syntax.

#### `working_directory`

Override the working directory used by the container.

Takes precedence over [the working directory specified on the container definition](containers.md#working_directory) (if any) and the
default working directory in the image.

### `dependencies`

List of other containers (not tasks) that should be started and healthy before starting the task container given in [`run`](#run), in addition to those defined on the container itself.

The behaviour is the same as if the dependencies were specified for the [`dependencies`](containers.md#dependencies) on the main task container's definition.

### `description`

Description shown when running `batect --list-tasks`.

### `group`

Group name used to group tasks when running `batect --list-tasks`.

## Examples

For more examples and real-world scenarios, take a look at the [sample projects](../../getting-started/sample-projects.md).

### Minimal configuration

```yaml title="batect.yml"
tasks:
  start-app:
    run:
      container: app
```

Running the task `start-app` will start the `app` container.

The container will run the command provided in the container configuration (or the default command in the image if there is no command
given for the container definition).

### Task with prerequisites

```yaml title="batect.yml"
tasks:
  build:
    run:
      container: build-env
      command: build.sh

  start-app:
    run:
      container: app
    prerequisites:
      - build
```

Running the task `start-app` will first run the `build` task (which runs `build.sh` in the `build-env` container), and then run the `app` container.

If the command `build.sh` exits with a non-zero exit code, `start-app` will not be run.

### Task with dependencies

```yaml title="batect.yml"
tasks:
  start-app:
    run:
      container: app
    dependencies:
      - database
      - auth-service-fake
```

Running the task `start-app` will do the following:

1. Build or pull the images for the `app`, `database` and `auth-service-fake` containers, as appropriate

2. Start the `database` and `auth-service-fake` containers

3. Wait for the `database` and `auth-service-fake` containers to report themselves as healthy
   ([if they have health checks defined](../../how-to/wait-for-dependencies.md))

4. Start the `app` container

### Task with environment variables

```yaml title="batect.yml"
tasks:
  start-app:
    run:
      container: app
      environment:
        COUNTRY: Australia
        SUPER_SECRET_VALUE: $SECRET_PASSWORD
        ANOTHER_SECRET_VALUE: ${SECRET_PASSWORD}
        OPTIMISATION_LEVEL: ${HOST_OPTIMISATION_LEVEL:-none}
```

Running the task `start-app` will start the `app` container with the following environment variables:

- The environment variable `COUNTRY` will have value `Australia`.

- The environment variables `SUPER_SECRET_VALUE` and `ANOTHER_SECRET_VALUE` will have the value of the `SECRET_PASSWORD` environment variable on
  the host. (So, for example, if `SECRET_PASSWORD` is `abc123` on the host, then `SUPER_SECRET_VALUE` will have the value `abc123` in the container.)

  If `SECRET_PASSWORD` is not set on the host, Batect will show an error message and not start the task.

- The environment variable `OPTIMISATION_LEVEL` will have the value of the `HOST_OPTIMISATION_LEVEL` environment variable on the host.

  If `HOST_OPTIMISATION_LEVEL` is not set on the host, then `OPTIMISATION_LEVEL` will have the value `none` in the container.

### Task with port mappings

```yaml title="batect.yml"
tasks:
  start-app:
    run:
      container: app
      ports:
        - 123:456
        - local: 1000
          container: 2000
```

Running the task `start-app` will start the `app` container with the following port mappings defined:

- Port 123 on the host will be mapped to port 456 inside the container
- Port 1000 on the host will be mapped to port 2000 inside the container

For example, this means that if a web server is listening on port 456 within the container, it can be accessed from the host at `http://localhost:123`.

The Dockerfile for the image used by the app container does not need to contain an `EXPOSE` instruction for ports 456 or 2000.

Note that this does not affect how containers launched by Batect as part of the same task access ports used by each other, just how they're exposed to the host.
Any container started as part of a task will be able to access any port on any other container at the address `container_name:container_port`. For example,
if a process running in another container wants to access the application running on port 456 in the `app` container, it would access it at `app:456`,
not `app:123`

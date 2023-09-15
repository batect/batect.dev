---
title: Overview
slug: /reference/config
---

:::note
This page reflects the options available in the [most recent version](https://github.com/batect/batect/releases/latest)
of Batect.
:::

Batect uses a YAML-based configuration file.

By convention, this file is called `batect.yml` and is placed in the root of your project (alongside the `batect` script).
You can use a different name or location and tell `batect` where to find it with the
[`--config-file` or `-f` option](../cli.mdx#--config-file-or--f).

The following is a sample "hello world" configuration file:

```yaml
containers:
  my-container:
    image: alpine:3.11.3

tasks:
  say-hello:
    description: Say hello to the nice person reading the Batect documentation
    run:
      container: my-container
      command: echo 'Hello world!'
```

Run it with `./batect say-hello`:

```text
$ ./batect say-hello
Running say-hello...
my-container: running echo 'Hello world!'

Hello world!

say-hello finished with exit code 0 in 1.2s.
```

Get a list of available tasks with `./batect --list-tasks`:

```text
$ ./batect --list-tasks
Available tasks:
- say-hello: Say hello to the nice person reading the Batect documentation
```

## Definition

Configuration files are made up of the following fields:

### `project_name`

The name of your project. Used to label any images built.

If a project name is not provided, the project name is taken from the directory containing the configuration file. For example, if your configuration
file is `/home/alex/projects/my-cool-app/batect.yml` and you do not provide a project name, `my-cool-app` will be used automatically.

Project names must be valid Docker references:

- they must contain only:

  - lowercase letters
  - digits
  - dashes (`-`)
  - single consecutive periods (`.`)
  - one or two consecutive underscores (`_`)

- they must not start or end with dashes, periods or underscores

### `config_variables`

Definitions for each of the config variables that are used throughout your configuration, in `name: options` format.

Config variable names must start with a letter and contain only letters, digits, dashes (`-`), periods (`.`) and underscores (`_`). They must not start with `batect`.

[Detailed reference for `config_variables`](config-variables.md)

### `containers`

Definitions for each [container](../../concepts/containers.md), in `name: options` format.

Container names must be valid Docker references:

- they must contain only:

  - lowercase letters
  - digits
  - dashes (`-`)
  - single consecutive periods (`.`)
  - one or two consecutive underscores (`_`)

- they must not start or end with dashes, periods or underscores

[Detailed reference for `containers`](containers.md)

### `include`

List of configuration files or bundles to [include](../../concepts/includes-and-bundles.md) in this project.

This is useful for breaking up a large project into smaller files, or for sharing configuration between projects.

[Detailed reference for `includes`](includes.md)

### `tasks`

Definitions for each [task](../../concepts/tasks.md), in `name: options` format.

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

[Detailed reference for `tasks`](tasks.md)

### `forbid_telemetry`

Set to `true` to disable [telemetry collection](/privacy#in-app-telemetry) whenever this project is used.

Setting this to `true` takes precedence over any consent you may have provided in the past or any of the telemetry-related command line options.

:::info

As of version 0.85.0, Batect no longer collects in-app telemetry.

:::

## Expressions

Some fields support expressions - references to environment variables on the host or [config variables](config-variables.md).

[Detailed reference for expressions](expressions.md)

## Anchors, aliases, extensions and merging

Batect supports YAML anchors and aliases. This allows you to specify a value in one place, and
refer to it elsewhere. For example:

```yaml
somewhere: &value-used-multiple-times the-value

# This is equivalent to somewhere-else: the-value
somewhere-else: *value-used-multiple-times
```

Anchors (`&...`) must be defined before they are referenced with an alias (`*...`).

Batect also supports extensions, which behave in an identical way, but allow you to define values
before you use it for the first time. The following is equivalent to the example above:

```yaml
.value-used-multiple-times: &value-used-multiple-times the-value

somewhere: *value-used-multiple-times
somewhere-else: *value-used-multiple-times
```

Extensions must be defined at the root level of your configuration file, and the key must start
with a period (`.`).

Batect also supports the merge operator (`<<`) in maps. For example:

```yaml
.common-environment: &common-environment
  ENABLE_COOL_FEATURE: true
  DATABASE_HOST: postgres:1234

tasks:
  run-app:
    run:
      ...
      environment: *common-environment # Just uses the values in common-environment as-is

  run-app-without-cool-feature:
    run:
      ...
      environment:
        << : *common-environment # Use common-environment as the basis for the environment in this task...
        ENABLE_COOL_FEATURE: false # ...but override the value of ENABLE_COOL_FEATURE
```

You can merge a single map with `<<: *other-map`, or multiple maps with `<<: [ *map-1, *map-2 ]`.

Local values take precedence over values merged into a map (regardless of the position of the `<<` entry),
and values from sources earlier in the list of maps take precedence over values from later sources.
(For example, if both `map-1` and `map-2` define a value for `PORT` in the example earlier, the
value in `map-1` is used.)

## Examples

Examples are provided in the reference for [`config_variables`](config-variables.md#examples), [`containers`](containers.md),
[`includes`](includes.md#examples) and [`tasks`](tasks.md#examples), as well as on the [cheat sheet](../cheat-sheet.mdx).

For further examples and real-world scenarios, take a look at the [sample projects](../../getting-started/sample-projects.md).

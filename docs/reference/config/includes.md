---
title: Includes
---

Includes allow you to separate your configuration into multiple files or share configuration between projects.

Includes can be from files, or from a Git repository.

Git repositories designed to be used in this way are referred to as 'bundles'. The [bundles page](/bundles) lists some publicly-available
bundles you can use in your own projects.

The format for included files is the same as for standard configuration files, but cannot have a [project name](overview.md#project_name).
Included files can include further files.

## Definition

### File includes

File includes can be specified in either of these two formats:

- Concise format:

  ```yaml
  include:
    - some-include.yml
  ```

- Expanded format:

  ```yaml
  include:
    - type: file
      path: some-include.yml
  ```

The path to the included file is relative to the directory containing the configuration file. (For example, if `/my-project/dir-a/batect.yml` has an include
for `../dir-b/extra-config.yml`, then `/my-project/dir-b/extra-config.yml` will be used.)

### Git includes

Git includes must be specified in this format:

```yaml
include:
  - type: git
    repo: https://github.com/batect/hello-world-bundle.git
    ref: 0.2.0
    path: some-bundle.yml # Optional, defaults to 'batect-bundle.yml'
```

- `repo` is the URL of the repository, as you would pass to `git clone`.

- `ref` is the name of the tag or branch, or commit hash to use.

  It's highly recommended that you use an immutable tag, as this ensures that you always get the same bundle contents each time.

- `path` is the path to the configuration file from the repository to include. It is optional and defaults to `batect-bundle.yml`.

The [bundles page](/bundles) lists some publicly-available bundles you can use in your own projects.

:::caution
Only use bundles that you trust, as they can contain arbitrary code that will be executed when you run a task or use a container from a bundle.
:::

## Paths in included files

Relative paths in included files such as paths for volume mounts or [build directories](containers.md#build_directory) will be resolved relative to that file's
directory.

Use the built-in [`batect.project_directory` config variable](config-variables.md#batectproject_directory) to get the path to the root project directory,
for example:

```yaml
containers:
  my-other-container:
    image: alpine:1.2.3
    volumes:
      - local: <{batect.project_directory}/scripts
        container: /code/scripts
```

## Examples

### File include

If `/my-project/a.yml` contains:

```yaml title="/my-project/a.yml"
containers:
  my-container:
    image: alpine:1.2.3

include:
  - includes/b.yml
```

And `/my-project/includes/b.yml` contains:

```yaml title="/my-project/includes/b.yml"
tasks:
  my-task:
    run:
      container: my-container
```

Then the resulting configuration is as if `/my-project/a.yml` was:

```yaml
containers:
  my-container:
    image: alpine:1.2.3

tasks:
  my-task:
    run:
      container: my-container
```

### Git include

The following configuration file includes version 0.2.0 of the [hello world bundle](https://github.com/batect/hello-world-bundle):

```yaml
include:
  - type: git
    repo: https://github.com/batect/hello-world-bundle.git
    ref: 0.2.0
```

This bundle adds a single `say-hello` task that can be run just like any other task: `./batect say-hello`.

## Building bundles

The following are some tips for building bundles:

### Consider building and publishing any Docker images your bundle uses rather than using [`build_directory`](containers.md#build_directory)

Pulling a pre-built image is generally faster than building an image from a Dockerfile.

It also prevents issues when packages or other external resources are removed.

### Do not store state from tasks in the bundle's working copy

Batect clones the repository and checks out the given tag or branch, and shares this working copy between projects to save time and disk space.
Storing state in this working copy would mean that different projects could interfere with one another.

Instead, store any state in the project's directory. Use the [`batect.project_directory` config variable](config-variables.md#batectproject_directory)
to get the path to the project's directory. See the [paths in included files](#paths-in-included-files) section above for an example.

### Publish immutable tags

Similar to Docker's behaviour when pulling image tags, Batect only checks that it has previously cloned the Git reference (branch name, tag name or
commit) - it does not check that the local clone is up-to-date with that reference. Therefore, using an immutable reference such as a tag ensures
that everyone using the project gets the exact same version of the bundle.

It is recommended you use [semantic versioning](https://semver.org/) when versioning bundles.

### Test your bundle

Testing your bundle ensures that it works as expected. The [hello world bundle](https://github.com/batect/hello-world-bundle) has an example
of how to do this.

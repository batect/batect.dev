---
title: .NET Core
---

## Example configuration

```yaml title="batect.yml"
containers:
  build-env:
    image: mcr.microsoft.com/dotnet/core/sdk:3.1.403
    volumes:
      - local: .
        container: /code
        options: cached
      - type: cache
        name: nuget-cache
        container: /root/.nuget/packages

      # Repeat this cache for each project in your codebase (make sure each one has a unique name):
      - type: cache
        name: project1-obj
        container: /code/project1/obj

    working_directory: /code
```

## Caching dependencies

:::tip
**tl;dr**: Mount a [cache](../../concepts/caches.md) into your container for downloaded NuGet packages, otherwise you'll have to download and compile your dependencies every
time the build runs
:::

By default, `dotnet` stores downloaded NuGet packages in `~/.nuget/packages`. However, because Batect destroys all of your containers once the task finishes,
this directory is lost at the end of every task run - which means that `dotnet` will have to download all of your dependencies again next time you run the task,
significantly slowing down the build.

The solution to this is to mount a [cache](../../concepts/caches.md) into the container at `~/.nuget/packages`, so that these downloaded dependencies are
persisted between builds.

Note that you can't use `~` in the container path for a volume mount:

- If you're using [run as current user mode](../../concepts/run-as-current-user-mode.md), use the home directory you specified for [`home_directory`](../../reference/config/containers.md#run_as_current_user).

- If you're not using [run as current user mode](../../concepts/run-as-current-user-mode.md), use `/root` as the home directory, as the vast majority of containers
  default to the root user and use this as the root user's home directory.

The [example configuration](#example-configuration) above demonstrates how to do this.

## Caching build output

:::tip
**tl;dr**: Mount a [cache](../../concepts/caches.md) into your container the `obj` directory for each project in your codebase, otherwise you'll experience poor performance on macOS and Windows,
and issues with some IDEs.
:::

The `obj` directory is used to store intermediate build output. However, when running on macOS and Windows,
Docker exhibits poor I/O performance for directories mounted from the macOS or Windows host, as discussed in the section on [caches](../../concepts/caches.md).

Furthermore, the `obj` directory contains files that include the absolute path to the NuGet packages in your project, which are only correct in the context of the container.
These incorrect paths can cause issues for some IDEs (including Rider) that rely on these files to show code completion information for dependencies.

The solution to this is to mount a [cache](../../concepts/caches.md) into your container for each project's `obj` directory. The [example configuration](#example-configuration)
above demonstrates how to do this.

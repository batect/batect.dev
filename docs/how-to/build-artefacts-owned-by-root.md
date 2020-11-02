---
title: Stop build artefacts being owned by root
---

<!--

If you're modifying this page, don't forget to update the corresponding page in the concepts directory as well.

-->

:::tip
**tl;dr**: If a container produces build artefacts in a mounted directory, enable `run_as_current_user`, otherwise they'll be owned by the `root`
Unix user
:::

On Linux, by default, the Docker daemon runs as `root`, and so all containers run as `root`. This means that when a container writes a file to a mounted directory,
it is owned by the `root` Unix user, making it difficult for other users to modify or delete the files. In particular, when a build task produces an artefact
and writes that artefact to a mounted directory, the artefact would be written as `root`.

(On macOS and Windows, the Docker daemon runs as the currently logged-in user and so any files created in mounted directories are owned by that user, so this is not an issue.)

To fix this issue, Batect can run containers in [run as current user mode](../concepts/run-as-current-user-mode.md), ensuring that all files written to a
mounted directory are created by the current user, not `root`.

This mode can be enabled on a per-container basis with the [`run_as_current_user` option](../reference/config/containers.md#run_as_current_user), for example::

```yaml title="batect.yml" {4-6}
containers:
  my-container:
    # ... other configuration for container
    run_as_current_user:
      enabled: true
      home_directory: /home/container-user
```

## Changes made when running in run as current user mode

When run as current user mode is enabled, the following configuration changes are made:

- The container is run with the current user's UID and GID (equivalent to passing `--user $(id -u):$(id -g)` to `docker run`)

- An empty directory is mounted into the container at `home_directory` for the user's home directory.

  :::warning
  If the directory given by `home_directory` already exists inside the image for this container, it is overwritten.
  :::

- A new `/etc/passwd` file is mounted into the container with two users: `root` and the current user. The current user's home directory is set to the
  value of `home_directory`. (If Batect is running as `root`, then just `root` is listed and it takes the home directory provided in `home_directory`.)

  This means that any other users defined in the container's image are effectively lost. Under most circumstances, this is not an issue.

- Similarly, a new `/etc/group` file is mounted into the container with two groups: `root` and the current user's primary group (usually `staff` on
  macOS, and the user's name on Linux). If Batect is running as `root`, then just `root` is listed.

  Again, this means that any other groups defined in the container's image are effectively lost. Under most circumstances, this is not an issue.

While run as current user mode is really only useful on Linux, for consistency, Batect makes the same configuration changes regardless of the host operating system.
These configuration changes are harmless on macOS and Windows.

## Special notes for Windows

On Windows, the container is run with UID 0 and GID 0 and the user and group name `root`. This is because any mounted directories
are always owned by `root` when running on Windows, and so running as another user can cause issues interacting with mounted directories.

For consistency, `root`'s home directory inside the container is set to match the directory specified by `home_directory`.

See [docker/for-win#63](https://github.com/docker/for-win/issues/63) and [docker/for-win#39](https://github.com/docker/for-win/issues/39)
for more details on this limitation.

:::info
Run as current user mode is not applicable for Windows containers.
:::

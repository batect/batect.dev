---
title: GitHub Actions
---

GitHub Actions' [Ubuntu 18.04](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu1804-README.md) and
[Ubuntu 20.04](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu2004-README.md) runners come pre-installed
with everything needed to run Batect. We recommend using Ubuntu 20.04.

To use the Ubuntu 20.04 runner, specify `runs-on: ubuntu:20.04` in your configuration file. For example:

```yaml
jobs:
  build:
    name: "Build"
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v3.0.2
      - name: Build application
        run: ./batect build
```

You can see a full example of using Batect with GitHub Actions in [the TypeScript sample project](https://github.com/batect/batect-sample-typescript).

## Caching between builds

If you're using [caches](../../concepts/caches.md), you can persist these between builds with the following configuration:

```yaml
jobs:
  build:
    name: "Build"
    runs-on: ubuntu-20.04
    env:
      BATECT_CACHE_TYPE: directory

    steps:
      - uses: actions/checkout@v3.0.2

      - name: Cache dependencies
        uses: actions/cache@v3.0.5
        with:
          path: .batect/caches
          key: batect-caches-${{ hashFiles('path to a file that uniquely identifies the contents of the caches') }}

      -  # ...other build steps
```

The `key` should be a value that changes when the contents of the cache change, and remains constant otherwise. A good candidate is the hash of a dependency lockfile,
such as `Gemfile.lock`, `package-lock.json`, `yarn.lock` or `go.sum`. The
[documentation for caching](https://docs.github.com/en/free-pro-team@latest/actions/guides/caching-dependencies-to-speed-up-workflows#using-the-cache-action) has
more details on `key`.

## Validating integrity of wrapper scripts

You can check that the `batect` and `batect.cmd` wrapper scripts have not been modified with the [`batect-wrapper-validation-action` action](https://github.com/batect/batect-wrapper-validation-action).

For example, add the following to an existing workflow:

```yaml
jobs:
  validate-batect-wrapper:
    name: Validate Batect wrapper scripts
    runs-on: ubuntu-20.04

    steps:
      - name: Check out code
        uses: actions/checkout@v3.0.2

      - name: Validate Batect wrapper scripts
        uses: batect/batect-wrapper-validation-action@v0.4.0
```

:::warning
This action **must** run before any invocations of Batect.
If the action runs after an invocation of Batect and the wrapper script has been modified maliciously, the malicious version may be able to modify itself to appear genuine.

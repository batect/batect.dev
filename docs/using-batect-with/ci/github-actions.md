---
title: GitHub Actions
---

GitHub Actions' [Ubuntu 18.04](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu1804-README.md) and
[Ubuntu 20.04](https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu2004-README.md) runners come pre-installed
with everything needed to run Batect. We recommend using Ubuntu 20.04.

To use the Ubuntu 20.04 runner, specify `runs-on: ubuntu:20.04` in your configuration file. For example:

```yaml title=".github/workflows/build.yml"
jobs:
  build:
    name: "Build"
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v1
      - name: Build application
        run: ./batect build
```

You can see a full example of using Batect with GitHub Actions in [the TypeScript sample project](https://github.com/batect/batect-sample-typescript).

## Caching between builds

If you're using [caches](../../concepts/caches.md), you can persist these between builds with the following configuration:

```yaml title=".github/workflows/build.yml"
jobs:
  build:
    name: "Build"
    runs-on: ubuntu-20.04
    env:
      BATECT_CACHE_TYPE: directory

    steps:
      - uses: actions/checkout@v1

      - name: Cache dependencies
        uses: actions/cache@v1
        with:
          path: .batect/caches
          key: batect-caches-${{ hashFiles('path to a file that uniquely identifies the contents of the caches') }}

      -  # ...other build steps
```

The `key` should be a value that changes when the contents of the cache change, and remains constant otherwise. A good candidate is the hash of a dependency lockfile,
such as `Gemfile.lock`, `package-lock.json`, `yarn.lock` or `go.sum`. The
[documentation for caching](https://docs.github.com/en/free-pro-team@latest/actions/guides/caching-dependencies-to-speed-up-workflows#using-the-cache-action) has
more details on `key`.

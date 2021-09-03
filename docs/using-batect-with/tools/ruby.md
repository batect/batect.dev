---
title: Ruby
---

You can see an example of configuring and using Ruby and Bundler with Batect in the [Ruby sample project](https://github.com/batect/batect-sample-ruby).

## Example configuration

```yaml title="batect.yml"
containers:
  build-env:
    image: ruby:2.7.2
    volumes:
      - local: .
        container: /code
      - type: cache
        name: bundle-cache
        container: /bundle-cache
    working_directory: /code
    environment:
      BUNDLE_PATH: /bundle-cache
```

## Caching dependencies

:::tip
**tl;dr**: Mount a [cache](../../concepts/caches.md) as the `BUNDLE_PATH` directory within the container, otherwise you'll have to download your dependencies every time the build runs
:::

By default, Bundler downloads all of your application's dependencies to the directory set by the `BUNDLE_PATH` environment variable.
However, because Batect destroys all of your containers once the task finishes, this directory is lost at the end of every task run -
which means that Bundler will have to download all of your dependencies again, significantly slowing down the build.

The solution to this is to set `BUNDLE_PATH` and mount a [cache](../../concepts/caches.md) into the container at that path, so that these
downloaded dependencies are persisted between builds.

The [example configuration](#example-configuration) above demonstrates how to do this.

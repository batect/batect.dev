---
title: Travis CI
---

Travis CI's [Ubuntu 20.04 (Focal Fossa) environment](https://docs.travis-ci.com/user/reference/focal/) includes everything Batect requires,
so all that needs to be done to use Batect with Travis CI is to configure this environment and enable the Docker service.

Adding the following to your `.travis.yml` file selects the Ubuntu 20.04 environment and enables Docker:

```yaml title=".travis.yml"
dist: focal

services:
  - docker
```

You can see a full example of using Batect with Travis CI in [the Java sample project](https://github.com/batect/batect-sample-java).

## Caching between builds

If you're using [caches](../../concepts/caches.md), you can persist these between builds with the following configuration:

```yaml title=".travis.yml"
dist: focal

services:
  - docker

env:
  - BATECT_CACHE_TYPE=directory

cache:
  directories:
    - .batect/caches
```

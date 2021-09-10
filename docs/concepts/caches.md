---
title: Caches
---

Batect supports mounting directories from the local filesystem into a container. This allows data to be persisted between task invocations, and
for the container to access local files such as application code.

However, Batect supports an alternative mechanism called a cache which is designed to provide high performance data persistence between task invocations.
These are often necessary for downloaded packages and libraries, such as Node.js's `node_modules` directory or Golang's `GOPATH`, where performance is
critical but accessibility outside the container is less important.

The need for this alternative mechanism stems from the fact that on macOS and Windows, ordinary Docker directory mounts like these come with a significant
performance penalty. While acceptable for application code, this performance penalty quickly accumulates when used for many files, as is the case for cached
packages and libraries.

For details see [how to use caches with containers](../reference/config/containers.md#caches).

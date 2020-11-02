---
title: Wait for dependencies to be ready in integration tests
---

:::tip
**tl;dr**: Make sure your image has a health check defined, and Batect will take care of the rest
:::

When running integration or end-to-end tests, you might need to start a number of external dependencies for your application, such as databases or
fakes for external services.

However, having these dependencies just running usually isn't sufficient - they also need to be ready to respond to requests. For example, the database
might take a few seconds to initialise and start accepting queries, and during this time, any requests to it will fail. So we'd like to avoid starting the tests
before these things are ready, otherwise the tests will fail unnecessarily.

Batect supports this scenario by taking advantage of [Docker's health check feature](https://docs.docker.com/engine/reference/builder/#healthcheck):

- If a container's image has a health check defined, Batect won't start any containers that depend on it until the health check reports that it is healthy.
- If a container's image does not have a health check defined, it is treated as though it has a health check that immediately reported that it is healthy.
- If the health check fails to report that the container is healthy before the timeout period expires, Batect won't start any other containers and will abort the task.

There's [a collection of sample health check scripts provided by Docker](https://github.com/docker-library/healthcheck/) you can use as inspiration.
The [sample projects](../getting-started/sample-projects.md) also use this technique extensively.

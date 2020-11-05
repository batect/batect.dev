---
title: Containers
---

A container is the environment in which a command is run. It is based on a Docker image, along with other configuration such as environment variables.

A fresh container is created each time a [task](tasks.md) starts, and is destroyed when the task ends. This ensures that every time a task runs, it has a consistent
environment to operate in.

Containers are never reused between tasks, even if both a task and one of its [prerequisites](../reference/config/tasks.md#prerequisites) needs the same container.

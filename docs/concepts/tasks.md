---
title: Tasks
---

Tasks are the smallest unit of work in Batect. They are an operation you can do: compiling your application, running the tests, running a linter
or deploying your application.

Tasks start one or more [containers](containers.md) in which the task runs. For example, when compiling your application, you might use a single container
containing build tools. This container is called the main task container, or just task container.

If other containers are required for the task, either because the task declares a [dependency](../reference/config/tasks.md#dependencies) or the main task
container declares a [dependency](../reference/config/containers.md#dependencies), these other containers are considered the dependencies for the task.

If one task must be run before another, this is called a [prerequisite](../reference/config/tasks.md#prerequisites). For example, a task that starts your
application might rely on having compiled it first.

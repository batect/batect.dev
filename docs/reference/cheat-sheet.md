---
title: Cheat sheet
---

## Skeleton configuration file

## Container basics

### Define a container

### Set the default command to run in a container

### Set the default working directory for a container

### Set an environment variable for a container

### Mount a file or directory into a container

### Docker images

#### Use an existing Docker image for a container

#### Build a local Dockerfile to use as the image for a container

#### Pass a build arg to a Dockerfile

#### Use a custom Dockerfile file name

## Task basics

### Define a task

### Override the command for the task container

### Override the working directory for the task container

### Set an environment variable for the task container

### Expose additional ports on the task container

## Task lifecycle

### Dependencies

#### Require one container to start before another (create a dependency)

#### Wait for a container to be ready to accept requests before starting containers that depend on it

#### Run a command in a container before starting containers that depend on it

#### Customise the environment variables of a dependency container

#### Expose additional ports on a dependency container

#### Customise the working directory of a dependency container

### Require one task to run to completion before another (create a prerequisite)

## Configurability

### Use an environment variable from the host machine

### Define and use a config variable

## Docker

### Access the host machine's Docker daemon from within a container

### Connect to a Docker daemon not using default connection settings

## Debugging

### See output from all containers when running a task

### Disable cleanup of containers when a task finishes

## Networking

### Expose a port to the host machine

### Expose a port to other containers in the task

### Add another hostname to a container

### Add extra hostnames to `/etc/hosts`

## Includes and bundles

### Split a configuration file into multiple files

### Reference a bundle

## Caching

### Cache a directory between task invocations

### Clean all caches for the current project

## CI

### Use directories for caches instead of volumes

### Avoiding port conflicts

## Config variables

### Defining a config variable

### Referencing a config variable

### Overriding a config variable on the command line

### Overriding a config variable with a file

## Other

### Avoiding build artefacts being owned by `root`

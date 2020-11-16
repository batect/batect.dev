---
title: Cheat sheet
---

## Skeleton configuration file

```yaml title="batect.yml"
containers:
  my-container:
    image: alpine:3.11.3

tasks:
  say-hello:
    description: Say hello to the nice person reading the Batect documentation
    run:
      container: my-container
      command: echo 'Hello world!'
```

## Container basics

### Define a container

```yaml title="batect.yml"
containers:
  my-container:
    image: alpine:3.11.3
    command: echo "Hello world"
```

Reference: [`containers`](config/containers.md)

### Set the default command to run in a container

```yaml title="batect.yml"
containers:
  my-container:
    # ...other config
    command: echo "Hello world"
```

Reference: [`command`](config/containers.md#command)

### Set the default working directory for a container

```yaml title="batect.yml"
containers:
  my-container:
    # ...other config
    working_directory: /my/working/dir
```

Reference: [`working_directory`](config/containers.md#working_directory)

### Set an environment variable for a container

```yaml title="batect.yml"
containers:
  my-container:
    # ...other config
    environment:
      MY_ENVIRONMENT_VARIABLE: "the value"
```

Reference: [`environment`](config/containers.md#environment)

### Mount a file or directory into a container

Mount the project directory into the container at `/code`:

```yaml title="batect.yml"
containers:
  my-container:
    # ...other config
    volumes:
      - local: .
        container: /code
```

Reference: [`volumes`](config/containers.md#volumes)

### Docker images

#### Use an existing Docker image for a container

```yaml title="batect.yml"
containers:
  my-container:
    image: alpine:3.11.3
```

Reference: [`image`](config/containers.md#image)

#### Build a local Dockerfile to use as the image for a container

Use the Dockerfile from the `images/my-container` directory:

```yaml title="batect.yml"
containers:
  my-container:
    build_directory: images/my-container
```

Reference: [`build_directory`](config/containers.md#build_directory)

#### Pass a build arg to a Dockerfile

```yaml title="batect.yml"
containers:
  my-container:
    build_directory: images/my-container
    build_args:
      MY_BUILD_ARG: "some value"
```

Reference: [`build_args`](config/containers.md#build_args)

#### Use a custom Dockerfile file name

Use the file `AnotherDockerfile` from the `images/my-container` directory:

```yaml title="batect.yml"
containers:
  my-container:
    build_directory: images/my-container
    dockerfile: AnotherDockerfile
```

Reference: [`dockerfile`](config/containers.md#dockerfile)

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

## Configurability

### Use an environment variable from the host machine

### Define and use a config variable

## Debugging

### See output from all containers when running a task

### Disable cleanup of containers when a task finishes

## Docker

### Access the host machine's Docker daemon from within a container

### Connect to a Docker daemon not using default connection settings

## Includes and bundles

### Split a configuration file into multiple files

### Reference a bundle

## Networking

### Expose a port to the host machine

### Expose a port to other containers in the task

### Add another hostname to a container

### Add extra hostnames to `/etc/hosts`

## Other

### Avoiding build artefacts being owned by `root`

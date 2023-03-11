---
title: Comparison with other tools
---

## Batect compared to using shell scripts to drive Docker

While it's certainly possible, using shell scripts to drive Docker to achieve the same result as what Batect does for you quickly
gets unwieldy and is difficult to effectively parallelise tasks that can run in parallel.

It is also difficult to ensure that all resources created during the task, such as containers and networks, are always correctly
cleaned up once the task completes, especially if the task fails.

## Batect compared to Docker Compose

Docker Compose can be used to implement the same idea that is at the core of Batect. However, using Docker Compose
for this purpose has a number of drawbacks.

In particular, Docker Compose is geared towards describing an application and its dependencies and starting this whole stack.
Its CLI is designed with this purpose in mind, making it frustrating to use day-to-day as a development tool and necessitating
the use of a higher-level script to automate its usage.

Furthermore, Docker Compose has no concept of tasks, again requiring the need to use a higher-level script to provide the ability
to execute different commands, run prerequisite tasks or setup commands and provide the discoverability that comes with a
[go script](https://www.thoughtworks.com/insights/blog/praise-go-script-part-i).

Docker Compose also has no equivalent concept to [bundles](../concepts/includes-and-bundles.md).

Docker Compose is also significantly slower than Batect, as Docker Compose does not parallelise all operations - in one test, Batect was 17%
faster than Docker Compose.

Docker Compose also does not elegantly support pulling together a set of containers in different configurations (eg. integration vs functional
testing), does not handle [proxies](../how-to/proxies.mdx) or [file permission issues on Linux](../how-to/build-artefacts-owned-by-root.md)
automatically and does not support [waiting for dependencies to become healthy](../how-to/wait-for-dependencies.md) as of
version 3.

## Batect compared to Dojo

[Dojo](https://github.com/kudulab/dojo) was built with very similar goals to Batect, but takes a slightly different approach.

There are a number of differences between Dojo and Batect:

- Dojo requires local installation, which means different developers can be running different versions of Dojo. Batect uses a wrapper
  script committed to source control to manage the version of Batect and ensure that everyone - developers and CI - use the same version and
  so have a consistent experience.

- Dojo requires Docker images to conform to [a number of requirements](https://github.com/kudulab/dojo#image-requirements-and-best-practices)
  to make the most of its features. Batect supports using any Docker image and instead requires some features to be configured in your Batect
  configuration file.

- Dojo does not have built-in support for running multiple containers and instead delegates to Docker Compose to manage multiple containers,
  with many of the drawbacks described above including noticeably lower performance.

- Dojo does not support using a local Dockerfile. Batect supports this as a first-class citizen, which allows developers to easily
  extend images for their needs without needing to publish them to a Docker image registry.

- Dojo has no concept of tasks and requires documentation such as a readme or a separate script to communicate these to developers.
  Batect supports tasks and prerequisites, removing the need for a separate [go script](https://www.thoughtworks.com/insights/blog/praise-go-script-part-i).
  Batect also supports the concept of [bundles](../concepts/includes-and-bundles.md), making it easy to share configuration between
  projects and bootstrap projects quickly with sensible defaults.

- Dojo has very verbose and detailed default output. Batect omits details that would largely be irrelevant in day-to-day development
  work by default and instead focuses on output from tasks.

- Dojo does not support Windows or Windows containers, whereas Batect does.

- Dojo lacks more advanced features that Batect provides to make working with Docker easier and faster, such as
  [cache volumes](../concepts/caches.md) and automatic configuration of [proxies](../how-to/proxies.mdx).

## Batect compared to Earthly

[Earthly](https://earthly.dev/) is focused on bringing CI/CD to your local
development, and is similar to Batect in the goals but differs in particulars
and focus.
Earthly relies on [BuildKit](https://github.com/moby/buildkit) which is a part
of more recent versions of Docker.

Where Earthly is like Batect:

- Both use Docker containers to isolate your build from the local environment.
- Both run locally the same build you have in CI (assuming you set up CI to
  use Batect or Earthly).
- Both let you compose your build so everything is not in one file.
- Both offer options for parallelization and caching to speed up your builds
  (see below on differences for caching).
- Both let you call out to your existing build, testing, or deployment tooling
- Both have strong documentation.

Where Earthly is different from Batect:

- Earthly is an installed program to your system (Batect is self-contained).
  There are GitHub Actions to add Earthly to your workflow script.
- Earthly is both a commercial product, and an open-source project.
  It provides paid-for plans to use their CI infrastructure, however it also
  works fine as a standalone program in your local and CI environments.
- Earthly has a larger support community.
- Earthly is more focused on Docker, less abstracted from details than Batect.
- Earthly and Batect have overlapping and also different caching features.
  Earthly is closer to Docker-style caching of layers.
- Earthly and Batect cache for you in different situations.
  Earthly tends to be more automatic for caching but also less under your
  control without additional configuration.
- Earthly configuration uses syntax like that of `Dockerfile` (called
  `Earthfile`) with some syntax borrowed from `Makefile` (but without the
  obsession for `<TAB>`s).
  Batect uses YAML for configuration syntax.
- Earthly is very verbose, and does not have options to quiet the output.
  Batect provides `-o quiet` which is suitable for keeping your builds
  _quiet_ in CI, and only complaining when something is wrong or could be
  improved.
- Configuration for Earthly can be more specific than Batect, but as a result
  also be more flexible. Each project needs to evaluate this for themselves.

## Batect compared to CI tools with a local runner

As an example, both GitLab CI and CircleCI have CLIs that allow you to run your build on your local machine, using the same
containers (and therefore environment) as they do when running your build on the CI server.

These tools have been designed to primarily be great CI servers, with the local CLI intended to be a convenience to allow
developers to test changes to the build configuration, rather than being a day-to-day development tool. Batect, on the other hand,
was designed from the beginning to be a great day-to-day development tool that also works equally well on CI.

Specific drawbacks of these tools compared to using Batect include:

- Batect provides a significantly better developer experience, with a simpler, easier to use CLI, clearer and more concise output (with more details
  available when required), and clearer error messages.

  One specific example would be the experience when a dependency container fails to become
  healthy - Batect will not only tell you which container did not become healthy, but also automatically displays the output from the last
  health check, and provides the option to not clean up the dependency containers if they fail to allow you to investigate further.

- Batect supports using local Dockerfiles to define the images used, rather than requiring that all images be pushed to a Docker registry.
  This provides a number of benefits:

  - Additional configuration or installation of software over and above what is included in the base image can be codified in the Dockerfile,
    built once per machine that uses it and then cached, saving time over doing this additional configuration or installation at the beginning
    of each and every build.

  - This also reduces the need to bloat the base image with configuration or software required by only a small proportion of users of the base image,
    reducing their size and improving maintainability.

  - Enabling changes to be made to the build and testing environments in the same repository as the application's code enhances traceability
    and understanding of why changes were made - the code change can form part of the same commit as the environmental change required to
    support it.

- These tools have only basic support for dependencies in other containers (for example, a database used for integration testing).
  They also require the configuration of other tools such as [Dockerize](https://github.com/jwilder/dockerize) to ensure that these dependencies are ready
  for use before they are needed. This does not take advantage of images' built-in health checks and the benefits this mechanism has, such as
  a warm-up period.

  Furthermore, this leaves the developer to manually manage transitive dependencies between containers. All of the limitations with
  regard to the images used for the build environment discussed above apply equally to dependency images.

- These tools don't provide time-saving functionality such as
  [automatically configuring proxies at image build time and in the container](../how-to/proxies.mdx).

- As these tools are designed to run the build and only the build in exactly the same way every time, they do not support passing additional
  arguments to the task, making it difficult to change options for tasks that may be helpful during development, such as enabling a debugger
  or more verbose logging.

- These tools don't support easily mounting the local working copy into the build container, which means they can't be used for tasks that
  rely on detecting changes to code, such as a continuous unit test task.

- These tools don't have a way to easily codify and share tasks not used in the build but used by developers, such as a task
  that spins up the app with stubbed dependencies.

## Batect compared to Vagrant

Vagrant's use of virtual machines means that Vagrant is very heavyweight, making it difficult to run multiple projects'
environments at once. This is especially problematic on CI servers where we'd like to run multiple builds in parallel.

Furthermore, the long-lived nature of virtual machines means that it's very easy for a developer's machine to get out of sync
with the desired configuration, and nothing automatically re-provisions the machine when the configuration is changed - a
developer has to remember to re-run the provisioning step if the configuration changes.

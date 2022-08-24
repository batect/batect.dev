---
title: System requirements
---

The following software must be installed to use Batect on [Linux and macOS](#linux-and-macos) or [Windows](#windows):

## Linux and macOS

- Docker 18.03.1 or later (Docker 19.03 or later highly recommended)

  - On Linux, Batect supports [the open source Docker daemon](https://docs.docker.com/engine/install/). Docker Desktop for Linux is supported but not required.
  - On macOS, Batect supports Docker Desktop, Rancher Desktop (when configured to use `dockerd` / `moby`) and Colima.

- Java 8 or newer (although this requirement will be removed before Batect v1.0)

- Bash

- `curl`

## Windows

- Docker 18.03.1 or later (Docker 19.03 or later highly recommended)

  - Batect supports both Docker Desktop and Rancher Desktop (when configured to use `dockerd` / `moby`).

- 64-bit Java 8 or later (although this requirement will be removed before Batect v1.0)

- Windows 10 or later, or Windows Server 2016 or later

:::note
Batect supports both Linux and Windows containers when running on Windows.
:::

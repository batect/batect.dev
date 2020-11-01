---
title: Buildkite
---

Batect can run on any Buildkite agent that meets Batect's [system requirements](../../getting-started/requirements.md#what-are-batects-system-requirements) - chiefly Docker and a JVM.

## Running with command evaluation disabled

Buildkite supports [disabling command evaluation](https://buildkite.com/docs/agent/v2/securing#disabling-command-eval), which requires all build scripts to be
invoked without arguments and take any necessary input as environment variables. This prevents the use of the Batect wrapper script, as it expects to receive
the task name and other options as command line options.

There are two solutions to this:

### Option 1: create step-specific shell scripts that invoke Batect

In this scenario, you create multiple shell scripts, one for each step in Buildkite.

For example, let's say you have three steps in Buildkite: one for building, one for testing, and another for packaging. You would need to create a separate
script for each of these steps that invokes Batect, for example:

```bash title="build.sh"
#! /usr/bin/env bash

set -euo pipefail

./batect build
```

```bash title="test.sh"
#! /usr/bin/env bash

set -euo pipefail

./batect unitTest
./batect integrationTest
./batect journeyTest
```

```bash title="package.sh"
#! /usr/bin/env bash

set -euo pipefail

./batect package
```

### Option 2: create a wrapper script that takes the task name as an environment variable

In this scenario, you create a single shell script and invoke it with different environment variable values for each step.

A script that executes the task given in the `BATECT_TASK` environment variable is:

```bash title="batect-wrapper.sh"
#! /usr/bin/env bash

set -euo pipefail

./batect "$BATECT_TASK"
```

Configure this in your Buildkite `pipeline.yml` as follows:

```yaml title="pipeline.yml"
steps:
  - label: Run build
    command: batect-wrapper.sh
    env:
      BATECT_TASK: build

  - label: Run unit tests
    command: batect-wrapper.sh
    env:
      BATECT_TASK: unitTest

  # ...and so on
```

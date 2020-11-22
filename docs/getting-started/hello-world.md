---
title: Hello world
---

Zero to 'hello world' in five minutes:

## Step 1: create your project

1. Create a new folder for your project.

2. Download the latest version of `batect` and `batect.cmd` from the [releases page](https://github.com/batect/batect/releases),
   and copy these scripts into your project folder.

   Note that you only need the scripts - you don't need to download `batect.jar`.

3. If you're on Linux or macOS, make sure the script is executable: run `chmod +x batect`.

## Step 2: define your environment and tasks

1. Create a file called `batect.yml` and add this [container](../concepts/containers.md) definition:

   ```yaml title="batect.yml"
   containers:
     my-container:
       image: alpine:3.11.3
   ```

   This container defines the environment our task will run in. In this case, we're using an Alpine Linux image.

2. After that container definition, add a [task](../concepts/tasks.md):

   ```yaml title="batect.yml" {5-10}
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

   This task defines what to do when the task is run. In this case, it'll just print a "Hello world!" message.

## Step 3: run the task

1. Open a terminal, change to the project folder and run `./batect --list-tasks`. You should see output similar to the following:

   ```text title=""$ ./batect --list-tasks"
   Available tasks:
   - say-hello: Say hello to the nice person reading the Batect documentation
   ```

   `--list-tasks` is available in every Batect project, and makes it easy for your team to discover what tasks are available to them.

2. Now let's run the task with `./batect say-hello`. You should see output similar to the following:

   ```text title="$ ./batect say-hello"
   Running say-hello...
   my-container: running echo 'Hello world!'

   Hello world!

   say-hello finished with exit code 0 in 1.2s.
   ```

## Where next?

- The [tutorial](tutorial.md) introduces the main concepts of Batect through a simple sample application
- The [sample projects](sample-projects.md) show Batect in a number of real-world scenarios

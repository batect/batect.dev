---
title: Includes and bundles
---

Includes allow you to import configuration defined elsewhere into your [project](projects.md). They are a useful mechanism for a number of situations:

- to keep configuration files small and manageable
- to share [tasks](tasks.md) and [containers](containers.md) between projects
- to take advantage of tasks and containers built and maintained by others, saving you time and effort

There are two main forms of includes: [file includes](#file-includes) and [Git includes](#git-includes]. Git includes allow you to include a bundle
of configuration.

## File includes

As the name suggests, [file includes](../reference/config/includes.md) import a single file into your project.
These are primarily used to split a large configuration file into smaller, more manageable pieces.

## Git includes

Git includes import configuration from a bundle defined in a Git repository. This allows you to share configuration within your team or organisation,
or take advantage of [publicly-available bundles](/bundles).

A bundle can be any Git repository containing a Batect configuration file. By default, this file is called `batect-bundle.yml` and follows the same
format as an ordinary configuration file.

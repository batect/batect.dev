---
title: Migrate an existing codebase to use Batect
---

Every codebase is unique, and there is no one "right" way to use Batect. However, based on our experience migrating existing codebases to use
Batect, we've collected some advice that may be helpful as you migrate your own codebase:

- [Start small, work incrementally](#start-small-work-incrementally)
- [Learn from others](#learn-from-others)
- [Ask the community](#ask-the-community)

## Start small, work incrementally

There's no need to convert your entire development lifecycle over to use Batect in one go. This could be quite time consuming, and means that you
won't see the benefit of Batect until you complete the process.

Instead, we highly recommend you work incrementally. Exactly what "incrementally" means for you will depend on your codebase.

As an example, for a stereotypical backend application with a database and a dependency on some external services, incrementally migrating to Batect
might follow these steps:

1. Establish a build environment in Batect that can be used to compile the application
2. Expand the build environment to support running unit tests, linters and other tools
3. Establish test environments, starting with integration tests[^1], and working one dependency at a time
4. Work through each dependency until all integration tests are running in Batect
5. Repeat for other, higher-level tests like end-to-end tests
6. Use the containers and configuration you've created as part of the above steps to run your application locally

[^1]:
    Everyone uses different terms for different kinds of tests. When we use the phrase integration test here, we're referring to tests that test the
    interaction between a component of your application and an external dependency like a database or service. Ham Vocke's
    [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html#IntegrationTests) explains this kind of testing in detail.

## Learn from others

We've collected lessons learnt from using Batect with a variety of tools and ecosystems in the
[using Batect with other tools and ecosystems](../using-batect-with/tools) section of the documentation.

There's also a huge number of [sample projects](../getting-started/sample-projects.md) that you can use as examples for your own projects.

## Ask the community

If you need help or run into a problem, don't be afraid to ask for help. You can [open an issue on GitHub](https://github.com/batect/batect/issues)
or [start a conversation on Spectrum](https://spectrum.chat/batect).

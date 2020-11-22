import React from "react";
import Layout from "@theme/Layout";
import styles from "./index.module.css";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

interface Bundle {
  name: string;
  url: string;
  isOfficial: boolean;
  description: string;
  toolName?: string;
  toolUrl?: string;
}

const bundles: Bundle[] = [
  {
    name: "bundle-dev-bundle",
    url: "https://github.com/batect/bundle-dev-bundle",
    isOfficial: true,
    description: "Provides an opinionated, sensible default environment for bundle development.",
  },
  {
    name: "golang-bundle",
    url: "https://github.com/batect/golang-bundle",
    isOfficial: true,
    description: "Provides a development container for Golang, with preconfigured sensible defaults.",
  },
  {
    name: "hadolint-bundle",
    url: "https://github.com/batect/hadolint-bundle",
    isOfficial: true,
    description: "Provides a task to lint Dockerfiles with Hadolint.",
    toolName: "Hadolint",
    toolUrl: "https://github.com/hadolint/hadolint",
  },
  {
    name: "hello-world-bundle",
    url: "https://github.com/batect/hello-world-bundle",
    isOfficial: true,
    description: "A sample bundle that demonstrates a basic development experience for creating a bundle, including an automated test setup.",
  },
  {
    name: "java-bundle",
    url: "https://github.com/batect/java-bundle",
    isOfficial: true,
    description: "Provides a development container for JVM-based languages that use Gradle, with preconfigured sensible defaults.",
  },
  {
    name: "node-bundle",
    url: "https://github.com/batect/node-bundle",
    isOfficial: true,
    description: "Provides a development container for Node.js, with preconfigured sensible defaults.",
  },
  {
    name: "shellcheck-bundle",
    url: "https://github.com/batect/shellcheck-bundle",
    isOfficial: true,
    description: "Provides a task to lint shell scripts with ShellCheck.",
    toolName: "ShellCheck",
    toolUrl: "https://github.com/koalaman/shellcheck",
  },
];

const OfficialBadge = () => <span className="badge badge--success">Official</span>;

const BundleDisplay = (bundle: Bundle) => (
  <div className="col col--3">
    <div className={clsx("card shadow--md", styles.bundleCard)}>
      <div className="card__header">
        <h3>{bundle.name}</h3>
        {bundle.isOfficial ? <OfficialBadge /> : null}
      </div>
      <div className="card__body">
        <p>{bundle.description}</p>
      </div>
      <div className="card__footer">
        <a className="button button--primary button--block" href={bundle.url}>
          More info
        </a>
        {bundle.toolName !== undefined ? (
          <a className={clsx("button button--secondary button--block", styles.toolInfoButton)} href={bundle.toolUrl}>
            Learn more about {bundle.toolName}
          </a>
        ) : null}
      </div>
    </div>
  </div>
);

const rightArrow = "\u2192";

const BundlesPage = () => (
  <Layout title="Bundles">
    <header className={clsx("hero hero--dark", styles.heroBanner)}>
      <div className="container">
        <p>Bundles are reusable collections of tasks and containers that you can use to simplify the setup of your own projects. </p>
        <Link to={useBaseUrl("docs/reference/config/includes#building-bundles")}>Learn more about creating your own bundles {rightArrow}</Link>
      </div>
    </header>
    <section className={clsx("container", styles.bundles)}>
      <div className="row">
        {bundles
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((bundle) => (
            <BundleDisplay {...bundle} key={bundle.url} />
          ))}
      </div>
    </section>
    <section className={clsx("container", styles.legend)}>
      <div>
        <OfficialBadge /> indicates bundles built and maintained by the Batect project
      </div>
    </section>
  </Layout>
);

export default BundlesPage;

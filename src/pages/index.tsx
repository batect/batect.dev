import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import CodeBlock from "@theme/CodeBlock";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./index.module.css";
import exampleYaml from "./home-page-example/batect.yml";
import AsciinemaPlayer from "../components/AsciinemaPlayer";

interface FeatureDetails {
  title: string;
  description: JSX.Element;
}

function Feature({ title, description }: FeatureDetails) {
  return (
    <div className={clsx("col col--4", styles.feature)}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const features: FeatureDetails[] = [
    {
      title: "Fast",
      description: (
        <>
          Tasks start quickly due to <Link to={useBaseUrl("/docs/concepts/task-lifecycle")}>parallelisation</Link> and run quickly thanks to{" "}
          <Link to={useBaseUrl("/docs/concepts/caches")}>caching</Link>. We&rsquo;ve seen 17% quicker execution than Docker Compose.
        </>
      ),
    },
    {
      title: "Consistent",
      description: <>Batect uses Docker to create a clean, isolated environment every time you run a task. No more &ldquo;works on my machine&rdquo;.</>,
    },
    {
      title: "Everywhere",
      description: (
        <>Your machine, your colleagues&rsquo; machines and CI: everyone runs exactly the same thing, every time. Works on macOS, Linux and even Windows.</>
      ),
    },
    {
      title: "Reusable",
      description: (
        <>
          Share tasks between projects with <Link to={useBaseUrl("/docs/concepts/includes-and-bundles")}>bundles</Link>. And use{" "}
          <Link to={useBaseUrl("/bundles")}>existing bundles</Link> to get up and running quickly.
        </>
      ),
    },
    {
      title: "Automated",
      description: <>Free your team from manual setup and maintenance of tools and dependencies: orchestrate integration tests with a single command.</>,
    },
    {
      title: "Simple",
      description: (
        <>
          No installation required. Just <Link to={useBaseUrl("/docs/getting-started/installation")}>drop the script in your project</Link> and run{" "}
          <code>./batect</code>.
        </>
      ),
    },
  ];

  return (
    <Layout>
      <header className={clsx("hero hero--dark", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">
            The <strong>fast</strong>, <strong>consistent</strong> way to run your development and testing tasks <strong>everywhere</strong>.
          </p>
          <div className={styles.buttons}>
            <Link className={clsx("button button--secondary button--lg", styles.getStarted)} to={useBaseUrl("docs/")}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.example}>
          <div className="container">
            <h2>Hello world in less than 30 seconds</h2>
            <div className="row">
              <div className="col col--6">
                <CodeBlock className="language-yaml" metastring='title="batect.yml"'>
                  {exampleYaml}
                </CodeBlock>
              </div>
              <div className="col col--6">
                <AsciinemaPlayer src={require("./home-page-example/recording.cast").default} width={200} height={19} preload={true} poster="npt:24" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;

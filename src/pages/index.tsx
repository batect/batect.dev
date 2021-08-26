import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import CodeBlock from "@theme/CodeBlock";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./index.module.css";
import helloWorldExampleYaml from "./home-page-examples/hello-world/batect.yml";
import AsciinemaPlayer from "../components/AsciinemaPlayer";
import NewsletterSignup from "./newsletterSignup";

interface FeatureDetails {
  title: string;
  description: JSX.Element;
}

function Feature({ title, description }: FeatureDetails) {
  return (
    <div className={clsx("col col--4", styles.feature)}>
      <h3>{title}</h3>
      <div>{description}</div>
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
          <p>
            Tasks are fast to start due to <Link to={useBaseUrl("/docs/concepts/task-lifecycle")}>parallelisation</Link> and fast to run thanks to{" "}
            <Link to={useBaseUrl("/docs/concepts/caches")}>caching</Link>. We&rsquo;ve seen 17% quicker execution than Docker Compose.
          </p>
          <p>
            Save time and share tasks between projects with <Link to={useBaseUrl("/docs/concepts/includes-and-bundles")}>bundles</Link>, and use{" "}
            <Link to={useBaseUrl("/bundles")}>existing bundles</Link> to get up and running quickly.
          </p>
        </>
      ),
    },
    {
      title: "Consistent",
      description: (
        <>
          <p>
            Free yourself from manual setup and maintenance of tools and dependencies: run builds, integration tests or deployments with a single command
            whether it&rsquo;s the first time you&rsquo;re using the project or the fiftieth.
          </p>
          <p>
            And because Batect uses Docker to create a clean, isolated environment{" "}
            <Link to={useBaseUrl("/docs/concepts/task-lifecycle")}>every time you run a task</Link>, there&rsquo;s no more &ldquo;works on my machine&rdquo;.
          </p>
        </>
      ),
    },
    {
      title: "Everywhere",
      description: (
        <>
          <p>
            Your machine, your colleagues&rsquo; machines and CI: everyone runs exactly the same thing, every time. Works on{" "}
            <Link to={useBaseUrl("/docs/getting-started/requirements")}>macOS, Linux and even Windows.</Link>
          </p>
          <p>
            No installation required. Just <Link to={useBaseUrl("/docs/getting-started/installation")}>drop the script in your project</Link> and run{" "}
            <code>./batect</code>.
          </p>
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
            Keep your builds green and developers happy with the <strong>fast</strong>, <strong>consistent</strong> way to run your development and testing
            tasks <strong>everywhere</strong>.
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
                  {helloWorldExampleYaml}
                </CodeBlock>
              </div>
              <div className="col col--6">
                <AsciinemaPlayer
                  src={require("./home-page-examples/hello-world/recording.cast").default}
                  width={200}
                  height={19}
                  preload={true}
                  poster="npt:24"
                />
              </div>
            </div>
          </div>
        </section>
        <section className={styles.example}>
          <div className="container">
            <h2>Local integration testing in less than 30 seconds</h2>
            <div className="row">
              <div className="col col--6">
                <AsciinemaPlayer
                  src={require("./home-page-examples/integration-testing/recording.cast").default}
                  width={200}
                  height={19}
                  preload={true}
                  poster="npt:8"
                />
              </div>
              <div className="col col--6">
                <div>
                  This project builds and tests a small service. Batect is configured to build the service, start a local version of the service&rsquo;s
                  dependencies (a database and an external service), then test the service.
                </div>
                <div className={styles.seeMoreLink}>
                  <Link to="https://github.com/batect/batect-sample-ruby">See the full sample project and try it for yourself &rarr;</Link>
                </div>
                <div className={styles.seeMoreLink}>
                  <Link to={useBaseUrl("/docs/getting-started/sample-projects")}>Explore all sample projects &rarr;</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <NewsletterSignup />
      </main>
    </Layout>
  );
}

export default Home;

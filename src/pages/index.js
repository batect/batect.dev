import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Fast',
    description: (
      <>
        Tasks start quickly due to parallelisation and run quickly thanks to caching.
        We've seen 17% quicker execution than Docker Compose.
      </>
    ),
  },
  {
    title: 'Consistent',
    description: (
      <>
        Batect uses Docker to create a clean, isolated environment every time you run a task.
        No more "works on my machine".
      </>
    ),
  },
  {
    title: 'Everywhere',
    description: (
      <>
        Your machine, your colleagues' machines and CI: everyone runs exactly the same thing, every time.
        Works on macOS, Linux and even Windows.
      </>
    ),
  },
  {
    title: 'Reusable',
    description: (
      <>
        Share tasks between projects with bundles. And use existing bundles to get up and running quickly.
      </>
    ),
  },
  {
    title: 'Automated',
    description: (
      <>
        Free your team from manual setup and maintenance of tools and dependencies: everyone automatically
        uses the same configuration.
      </>
    ),
  },
  {
    title: 'Simple',
    description: (
      <>
        No installation required, just drop the script in your project and run <code>./batect</code>.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout>
      <header className={clsx('hero hero--dark', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">
            The <strong>fast</strong>, <strong>consistent</strong> way to run your development and testing tasks <strong>everywhere</strong>.
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;

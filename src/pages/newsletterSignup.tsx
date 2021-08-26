import React from "react";
import styles from "./newsletterSignup.module.css";

const NewsletterSignup = () => (
  <section className={styles.newsletterSignup}>
    <div className="container">
      <div className="row">
        <div className="col col--12">
          <h2>Subscribe to the Batect newsletter</h2>
          <div>Get news and announcements direct to your inbox.</div>
          <form
            action="https://dev.us5.list-manage.com/subscribe/post?u=c191f58917a1c5eab0832c05e&amp;id=e1908592e5"
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            target="_blank"
            noValidate={true}
          >
            <input type="email" name="EMAIL" className="email" id="mce-EMAIL" placeholder="Email address" required />
            <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button button--primary " />
            <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
              <input type="text" name="b_c191f58917a1c5eab0832c05e_e1908592e5" tabIndex={-1} value="" readOnly={true} />
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
);

export default NewsletterSignup;

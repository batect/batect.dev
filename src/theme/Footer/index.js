import OriginalFooter from "@theme-original/Footer";
import React from "react";
import NewsletterSignup from "../../components/NewsletterSignup";

export default function Footer(props) {
  return (
    <>
      <NewsletterSignup />
      <OriginalFooter {...props} />
    </>
  );
}

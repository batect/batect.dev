FROM algolia/docsearch-scraper:v1.15.0@sha256:12c543d8b13a8dd761cfd67f935f6d3a9afb16a62147f07bf5c6ab50346cf317

RUN apt-get update -y && apt-get install -y jq

COPY run.sh /run.sh

ENTRYPOINT ["/run.sh"]

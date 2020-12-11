FROM algolia/docsearch-scraper:v1.13.0@sha256:ca909fe6ac9757eb200dbf0e4eca068a9d2cd904273fb7f113264acc0635f0eb

RUN apt-get update -y && apt-get install -y jq

COPY run.sh /run.sh

ENTRYPOINT ["/run.sh"]

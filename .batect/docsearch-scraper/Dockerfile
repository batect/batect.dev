FROM algolia/docsearch-scraper:v1.16.0@sha256:7bc1cd5aa4783bf24be9ddd6ef22a629b6b43e217b3fa220b6a0acbdeb83b8f8

RUN apt-get update -y && apt-get install -y jq

COPY run.sh /run.sh

ENTRYPOINT ["/run.sh"]

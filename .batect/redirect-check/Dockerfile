FROM alpine:3.17.0@sha256:8914eb54f968791faf6a8638949e480fef81e697984fba772b3976835194c6d4

RUN apk add --no-cache \
    python3 \
    py3-pip

RUN mkdir -p /scripts
COPY requirements.txt /scripts/requirements.txt
RUN pip install -r /scripts/requirements.txt

COPY redirect-check.py /scripts/redirect-check.py
RUN chmod +x /scripts/redirect-check.py

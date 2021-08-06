FROM alpine:3.14.1@sha256:3afa84775f9bf065eb68694d88f1f455c80ac87063d7367b3678489e671bcad9

RUN apk add --no-cache \
    python3 \
    py3-pip

RUN mkdir -p /scripts
COPY requirements.txt /scripts/requirements.txt
RUN pip install -r /scripts/requirements.txt

COPY redirect-check.py /scripts/redirect-check.py
RUN chmod +x /scripts/redirect-check.py

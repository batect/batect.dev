FROM alpine:3.13.3@sha256:826f70e0ac33e99a72cf20fb0571245a8fee52d68cb26d8bc58e53bfa65dcdfa

RUN apk add --no-cache \
    python3 \
    py3-pip

RUN mkdir -p /scripts
COPY requirements.txt /scripts/requirements.txt
RUN pip install -r /scripts/requirements.txt

COPY redirect-check.py /scripts/redirect-check.py
RUN chmod +x /scripts/redirect-check.py

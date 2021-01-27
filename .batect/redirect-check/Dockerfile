FROM alpine:3.12.3@sha256:3c7497bf0c7af93428242d6176e8f7905f2201d8fc5861f45be7a346b5f23436

RUN apk add --no-cache \
    python3 \
    py3-pip

RUN mkdir -p /scripts
COPY requirements.txt /scripts/requirements.txt
RUN pip install -r /scripts/requirements.txt

COPY redirect-check.py /scripts/redirect-check.py
RUN chmod +x /scripts/redirect-check.py

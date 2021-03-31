FROM alpine:3.13.4@sha256:ec14c7992a97fc11425907e908340c6c3d6ff602f5f13d899e6b7027c9b4133a

RUN apk add --no-cache \
    python3 \
    py3-pip

RUN mkdir -p /scripts
COPY requirements.txt /scripts/requirements.txt
RUN pip install -r /scripts/requirements.txt

COPY redirect-check.py /scripts/redirect-check.py
RUN chmod +x /scripts/redirect-check.py

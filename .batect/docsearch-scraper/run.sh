#! /usr/bin/env bash

set -euo pipefail

CONFIG=$(jq -r tostring /config/config.json) \
  pipenv run python -m src.index

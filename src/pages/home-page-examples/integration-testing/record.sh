#! /usr/bin/env bash

set -euo pipefail

rm -f recording.cast
asciinema rec --command "fish --init-command 'source ../init.fish' --interactive --private" ./recording.cast

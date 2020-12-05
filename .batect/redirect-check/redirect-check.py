#! /usr/bin/env python3

import sys
import toml
import urllib.error
import urllib.request


def main():
    base_url = sys.argv[1]
    config_file = sys.argv[2]

    print(f"Checking redirects in {config_file} with base URL {base_url}...")
    print()

    redirects = toml.load(config_file)["redirects"]
    broken_count = 0

    for redirect in redirects:
        ok = check_redirect(redirect, base_url)

        if not ok:
            broken_count = broken_count + 1

    print()

    if broken_count == 0:
        print(f"{Colors.GREEN}Check succeeded, no broken redirects.{Colors.RESET}")
    else:
        print(f"{Colors.RED}{broken_count} broken redirect(s), see output above.{Colors.RESET}")
        sys.exit(1)


def check_redirect(redirect, base_url):
    original = redirect["from"]
    destination = redirect["to"]

    print(f"{original} -> {destination}: checking... ", end='')

    try:
        with urllib.request.urlopen(f"{base_url}{destination}") as response:
            if response.status == 200:
                print(f"{Colors.GREEN}OK{Colors.RESET}")
                return True
            else:
                print(f"{Colors.RED}Failed! Response was HTTP {response.status}{Colors.RESET}")
                return False

    except urllib.error.HTTPError as err:
        print(f"{Colors.RED}Failed! Response was HTTP {err.code}{Colors.RESET}")
        return False


class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    RESET = '\033[0m'


if __name__ == '__main__':
    main()

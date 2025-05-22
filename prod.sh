#!/usr/bin/env bash

set -o pipefail # also fail on piped commands (e.g. cat myfile.txt | grep timo)
set -o nounset  # fail when accessing unset vars
set -o errexit  # exit when any command fails

function show_usage() {
    echo "picossg.dev prod utils"
    echo "Usage: $0 <command>"
    echo ""
    echo "Available commands:"
    echo "  update  - Pull latest changes and rebuild containers"
    echo "  down    - Stop and remove containers, networks, and volumes"
}

function cmd_update() {
    # just rebuilding the site, since we are only serving static files, no container restart or such needed
    git pull && docker compose run --rm --remove-orphans picossg_node npm run build:site
}

function cmd_down() {
    docker compose down
}

# Main command handling
if [ $# -eq 0 ]; then
    show_usage
    exit 1
fi

command="$1"
case "$command" in
    "update")
        cmd_update
        ;;
    "down")
        cmd_down
        ;;
    *)
        echo "Error: Unknown command '$command'"
        show_usage
        exit 1
        ;;
esac


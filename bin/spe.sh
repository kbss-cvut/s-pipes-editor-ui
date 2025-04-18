#!/bin/bash

function print_usage() {
        echo "Start SPipes Editor on specified SPipes script PATH(s)."
        echo "Usage: "
        echo -e "\t$0 PATH..."
        echo "Examples: "
        echo -e "\tEXAMPLE-1 (load scripts from current directory): $0 ." 
        echo -e "\tEXAMPLE-2 (load scripts from multiple directories): $0 /script/main /scripts/maintenance" 
}


if [ "$#" -eq 0 ]; then
        print_usage
        exit
fi

PROJECT_DIR=$(dirname $(readlink -m $0/..))


# variable to store absolute paths from provided parameters
CUSTOM_SCRIPT_PATHS=""

for arg in "$@"; do
  absolute_path=$(readlink -f "$arg")

  if [ -z "$CUSTOM_SCRIPT_PATHS" ]; then
    CUSTOM_SCRIPT_PATHS="$absolute_path"
  else
    CUSTOM_SCRIPT_PATHS="$CUSTOM_SCRIPT_PATHS;$absolute_path"
  fi
done

DEVELOPMENT_OPTIONS=(
# -f .dev/dc--allign-filesystems-in-linux.yml
# -f .dev/dc-s-pipes-engine--debug-with-suspend.yml
# -f dc-s-pipes-engine--substitute.yml
)

cd $PROJECT_DIR/deploy
CUSTOM_SCRIPT_PATHS="$CUSTOM_SCRIPT_PATHS" docker compose -f docker-compose.yml "${DEVELOPMENT_OPTIONS[@]}" --env-file=.env up
cd


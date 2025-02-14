#!/usr/bin/env sh
set -eu

envsubst '${S_PIPES_APP_TITLE} ${S_PIPES_API_URL} ' < /etc/nginx/config.js.template > /usr/share/nginx/html/config.js

exec "$@"
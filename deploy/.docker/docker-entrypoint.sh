#!/usr/bin/env sh
set -eu

envsubst '${S_PIPES_EDITOR_APP_TITLE} ${S_PIPES_EDITOR_API_URL}' < /etc/nginx/config.js.template > /var/www/config.js

exec "$@"
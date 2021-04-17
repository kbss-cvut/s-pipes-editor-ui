#!/usr/bin/env sh
set -eu

envsubst '${SERVICE_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec "$@"
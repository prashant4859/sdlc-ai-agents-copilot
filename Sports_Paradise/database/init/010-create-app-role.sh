#!/bin/sh
set -eu

: "${POSTGRES_APP_USER:?POSTGRES_APP_USER is required}"
: "${POSTGRES_APP_PASSWORD:?POSTGRES_APP_PASSWORD is required}"

if [ "$POSTGRES_APP_USER" = "$POSTGRES_USER" ]; then
  echo "POSTGRES_APP_USER must differ from POSTGRES_USER." >&2
  exit 1
fi

# Keep dynamically generated password SQL out of PostgreSQL error logs.
psql \
  --set=ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --command="SET log_min_error_statement TO 'panic'" \
  --file=/opt/sports-paradise/init/010-create-app-role.sql

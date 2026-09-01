#!/bin/sh
set -eu

DATA_DIR=/app/data
DB_PATH="$DATA_DIR/qazmind.db"

mkdir -p "$DATA_DIR"
if [ ! -f "$DB_PATH" ] && [ -f /app/seed/qazmind.db ]; then
  cp /app/seed/qazmind.db "$DB_PATH"
fi

exec "$@"

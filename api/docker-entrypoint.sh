#!/usr/bin/env bash
set -e

echo "Starting API container..."

if [ -n "${DATABASE_URL}" ]; then
  echo "Waiting for database at ${DATABASE_URL}..."
  python - << 'PY'
import os, time, sys
import psycopg2
from urllib.parse import urlparse

url = os.environ["DATABASE_URL"]
parsed = urlparse(url)

for attempt in range(30):
    try:
        conn = psycopg2.connect(
            dbname=parsed.path.lstrip("/"),
            user=parsed.username,
            password=parsed.password,
            host=parsed.hostname,
            port=parsed.port or 5432,
        )
        conn.close()
        print("Database is ready.")
        sys.exit(0)
    except Exception as e:
        print(f"[attempt {attempt+1}/30] Database not ready yet: {e}")
        time.sleep(2)

print("Could not connect to database, exiting.")
sys.exit(1)
PY
fi

export FLASK_APP="${FLASK_APP:-app:create_app}"

# If the container is started with an explicit command (e.g. `flask db stamp head`),
# run it and skip the default "migrate + run server" behavior.
if [ "$#" -gt 0 ]; then
  echo "Executing command: $*"
  exec "$@"
fi

# Automatic DB migrations on startup:
# - AUTO_MIGRATE=1: runs `flask db upgrade` (safe/expected for prod).
# - AUTO_GENERATE_MIGRATIONS=1: additionally runs `flask db migrate` to autogenerate
#   new migrations (recommended only for local dev).
if [ "${AUTO_MIGRATE:-1}" = "1" ]; then
  echo "Running automatic upgrade (flask db upgrade)..."
  flask db upgrade

  if [ "${AUTO_GENERATE_MIGRATIONS:-0}" = "1" ]; then
    echo "AUTO_GENERATE_MIGRATIONS enabled; generating migrations (flask db migrate) and upgrading..."
    # `flask db migrate` may fail if there are no model changes; log and continue.
    if ! flask db migrate -m "auto migration"; then
      echo "flask db migrate failed (often OK if there are no model changes). Continuing with upgrade..."
    fi
    flask db upgrade
  fi
else
  echo "AUTO_MIGRATE disabled; skipping migrations."
fi

: "${FLASK_ENV:=production}"

if [ "${FLASK_ENV}" = "development" ]; then
  echo "Starting Flask development server with auto-reload..."
  flask run --host=0.0.0.0 --port=5000 --reload
else
  echo "Starting Flask server..."
  flask run --host=0.0.0.0 --port=5000
fi
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

if [ "${AUTO_MIGRATE:-1}" = "1" ]; then
  echo "Running automatic migrations (flask db migrate + flask db upgrade)..."
  # db migrate may fail if there are no changes; log and continue to upgrade
  if ! flask db migrate -m "auto migration"; then
    echo "flask db migrate failed (often OK if there are no model changes). Continuing with upgrade..."
  fi
  flask db upgrade
else
  echo "AUTO_MIGRATE disabled; running flask db upgrade only..."
  flask db upgrade
fi

: "${FLASK_ENV:=production}"

if [ "${FLASK_ENV}" = "development" ]; then
  echo "Starting Flask development server with auto-reload..."
  flask run --host=0.0.0.0 --port=5000 --reload
else
  echo "Starting Flask server..."
  flask run --host=0.0.0.0 --port=5000
fi



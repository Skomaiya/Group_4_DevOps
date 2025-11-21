#!/usr/bin/env sh
set -e

# Wait for Postgres only when using Postgres engine
if [ "${DB_ENGINE}" = "django.db.backends.postgresql" ]; then
  echo "Waiting for Postgres at ${DB_HOST:-db}:${DB_PORT:-5432}..."
  # Try to connect using psycopg2; 30 attempts, ~60s max
  python - <<'PY'
import os, time
import psycopg2
host=os.getenv('DB_HOST','db')
port=int(os.getenv('DB_PORT','5432'))
user=os.getenv('DB_USER','myuser')
password=os.getenv('DB_PASSWORD','mypassword')
dbname=os.getenv('DB_NAME','learnhub_db')

for i in range(30):
    try:
        psycopg2.connect(host=host, port=port, user=user, password=password, dbname=dbname).close()
        print("Postgres is ready.")
        break
    except Exception as e:
        print(f"DB not ready ({i+1}/30):", e)
        time.sleep(2)
else:
    raise SystemExit("Postgres not ready after retries.")
PY
fi

echo "Running migrations..."
python manage.py migrate --noinput

exec "$@"

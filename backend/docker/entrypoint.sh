#!/bin/sh
set -e

HOST="${DB_HOST:-mysql}"
PORT="${DB_PORT:-3306}"

printf 'Waiting for MySQL at %s:%s...\n' "$HOST" "$PORT"
while ! python - <<PYCODE
import socket
import sys

host = "${HOST}"
port = int("${PORT}")
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.settimeout(1)
    try:
        sock.connect((host, port))
    except OSError:
        sys.exit(1)
PYCODE
do
  sleep 1
done

echo "MySQL is up, running migrations..."
python manage.py migrate --noinput

echo "Starting Django server..."
exec python manage.py runserver 0.0.0.0:8000
#!/usr/bin/env sh
set -eu

# If Let's Encrypt certs don't exist yet, create a short-lived self-signed cert
# so nginx can start and serve the HTTP-01 challenge endpoint.

DOMAIN="${DOMAIN:-toyourrescue.org}"
LIVE_DIR="/etc/letsencrypt/live/${DOMAIN}"

FULLCHAIN="${LIVE_DIR}/fullchain.pem"
PRIVKEY="${LIVE_DIR}/privkey.pem"
CHAIN="${LIVE_DIR}/chain.pem"

if [ ! -f "${FULLCHAIN}" ] || [ ! -f "${PRIVKEY}" ]; then
  echo "No certificate found for ${DOMAIN}. Creating a temporary self-signed certificate..."
  mkdir -p "${LIVE_DIR}"

  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout "${PRIVKEY}" \
    -out "${FULLCHAIN}" \
    -subj "/CN=${DOMAIN}" >/dev/null 2>&1

  # nginx.conf references chain.pem as ssl_trusted_certificate
  cp -f "${FULLCHAIN}" "${CHAIN}"
fi

exec "$@"



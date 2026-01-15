#!/usr/bin/env sh
set -eu

# If Let's Encrypt certs don't exist yet, create a short-lived self-signed cert
# so nginx can start and serve the HTTP-01 challenge endpoint.

DOMAIN="${DOMAIN:-toyourrescue.org}"

LE_LIVE_DIR="/etc/letsencrypt/live/${DOMAIN}"
LE_FULLCHAIN="${LE_LIVE_DIR}/fullchain.pem"
LE_PRIVKEY="${LE_LIVE_DIR}/privkey.pem"
LE_CHAIN="${LE_LIVE_DIR}/chain.pem"

TLS_DIR="/etc/nginx/tls"
SELF_DIR="${TLS_DIR}/selfsigned/${DOMAIN}"
SELF_FULLCHAIN="${SELF_DIR}/fullchain.pem"
SELF_PRIVKEY="${SELF_DIR}/privkey.pem"
SELF_CHAIN="${SELF_DIR}/chain.pem"
TLS_CONF="${TLS_DIR}/ssl.conf"

mkdir -p "${TLS_DIR}"

if [ -f "${LE_FULLCHAIN}" ] && [ -f "${LE_PRIVKEY}" ]; then
  echo "Found Let's Encrypt certificate for ${DOMAIN}. Configuring nginx to use it."
  {
    echo "ssl_certificate ${LE_FULLCHAIN};"
    echo "ssl_certificate_key ${LE_PRIVKEY};"
    if [ -f "${LE_CHAIN}" ]; then
      echo "ssl_trusted_certificate ${LE_CHAIN};"
    fi
  } > "${TLS_CONF}"
else
  echo "No Let's Encrypt certificate found for ${DOMAIN}. Creating a temporary self-signed certificate..."
  mkdir -p "${SELF_DIR}"

  if [ ! -f "${SELF_FULLCHAIN}" ] || [ ! -f "${SELF_PRIVKEY}" ]; then
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
      -keyout "${SELF_PRIVKEY}" \
      -out "${SELF_FULLCHAIN}" \
      -subj "/CN=${DOMAIN}" >/dev/null 2>&1
    cp -f "${SELF_FULLCHAIN}" "${SELF_CHAIN}"
  fi

  {
    echo "ssl_certificate ${SELF_FULLCHAIN};"
    echo "ssl_certificate_key ${SELF_PRIVKEY};"
    echo "ssl_trusted_certificate ${SELF_CHAIN};"
  } > "${TLS_CONF}"
fi

exec "$@"



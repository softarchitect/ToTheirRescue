#!/usr/bin/env bash
set -euo pipefail

# Bootstrap Let's Encrypt for the Docker Compose production stack.
#
# Why this exists:
# - `nginx.conf` is configured for HTTPS and expects certs under:
#     ./certbot/conf/live/<domain>/
# - On first deploy those files do not exist, so Nginx fails to start.
#
# What this script does:
# 1) Creates a temporary self-signed cert so Nginx can start on :80/:443
# 2) Runs certbot (webroot / HTTP-01) to obtain a real certificate
# 3) Reloads Nginx to pick up the real certificate
#
# Requirements:
# - DNS A/AAAA records for the domains point to this server
# - Port 80 is reachable from the internet (HTTP-01 challenge)
# - `openssl` is installed on the host (sudo apt-get install -y openssl)

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose-prod.yml}"
DOMAIN="${DOMAIN:-toyourrescue.org}"
DOMAINS=("${DOMAIN}" "www.${DOMAIN}")
EMAIL="${EMAIL:-}"
STAGING="${STAGING:-0}" # set to 1 to use Let's Encrypt staging

data_path="./certbot"
conf_path="${data_path}/conf"
www_path="${data_path}/www"
live_path="${conf_path}/live/${DOMAIN}"

if ! command -v openssl >/dev/null 2>&1; then
  echo "ERROR: openssl is required on the host. Install with: sudo apt-get update && sudo apt-get install -y openssl" >&2
  exit 1
fi

mkdir -p "${www_path}/.well-known/acme-challenge"
mkdir -p "${live_path}"

if [ -f "${live_path}/fullchain.pem" ] && [ -f "${live_path}/privkey.pem" ]; then
  echo "Existing cert found at ${live_path}; skipping bootstrap."
  exit 0
fi

echo "Creating temporary self-signed certificate for ${DOMAIN}..."
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout "${live_path}/privkey.pem" \
  -out "${live_path}/fullchain.pem" \
  -subj "/CN=${DOMAIN}" >/dev/null 2>&1

# nginx.conf references chain.pem as ssl_trusted_certificate.
cp -f "${live_path}/fullchain.pem" "${live_path}/chain.pem"

echo "Starting nginx (and app) so HTTP-01 challenges can be served..."
docker compose -f "${COMPOSE_FILE}" up -d --build nginx web api

echo "Requesting Let's Encrypt certificate via certbot (webroot)..."
email_args=()
if [ -n "${EMAIL}" ]; then
  email_args+=(--email "${EMAIL}")
else
  email_args+=(--register-unsafely-without-email)
fi

staging_arg=()
if [ "${STAGING}" = "1" ]; then
  staging_arg+=(--staging)
fi

domain_args=()
for d in "${DOMAINS[@]}"; do
  domain_args+=(-d "${d}")
done

docker compose -f "${COMPOSE_FILE}" run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  "${staging_arg[@]}" \
  "${email_args[@]}" \
  "${domain_args[@]}" \
  --rsa-key-size 4096 \
  --agree-tos \
  --force-renewal

echo "Reloading nginx to pick up the real certificate..."
docker compose -f "${COMPOSE_FILE}" exec nginx nginx -s reload

echo "Done."



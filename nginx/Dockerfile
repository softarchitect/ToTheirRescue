FROM nginx:stable-alpine

# Needed to generate a temporary self-signed certificate on first boot,
# so nginx can start even before Let's Encrypt certs exist.
RUN apk add --no-cache openssl

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]



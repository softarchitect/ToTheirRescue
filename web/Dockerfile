FROM node:22-alpine

WORKDIR /app

# Build-time API base URL for Next.js (must be passed via --build-arg)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package.json package-lock.json ./
# Install all dependencies including devDependencies (needed for build tools like @tailwindcss/postcss)
RUN npm config set fetch-retries 4 \
  && npm config set fetch-retry-factor 2 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 60000 \
  && npm config set fetch-timeout 90000 \
  && npm config set registry https://registry.npmjs.org/ \
  && export NODE_OPTIONS="--dns-result-order=ipv4first" \
  && success=0 \
  && for i in 1 2 3; do \
    echo "npm ci attempt ${i}/3"; \
    npm ci --legacy-peer-deps --no-audit --fund=false && success=1 && break; \
    echo "npm ci failed on attempt ${i}; waiting before retry..."; \
    npm cache verify || true; \
    sleep $((i * 15)); \
  done \
  && if [ "$success" -ne 1 ]; then echo "npm ci failed after retries"; exit 1; fi

COPY . .

RUN npm run build

EXPOSE 3003

CMD ["npm", "run", "start"]

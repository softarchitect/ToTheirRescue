FROM node:22-alpine

WORKDIR /app

# Build-time API base URL for Next.js (must be passed via --build-arg)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package.json package-lock.json ./
# Install all dependencies including devDependencies (needed for build tools like @tailwindcss/postcss)
RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3003

CMD ["npm", "run", "start"]

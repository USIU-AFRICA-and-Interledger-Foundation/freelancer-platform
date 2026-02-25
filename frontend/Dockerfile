FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

COPY src ./src
COPY public ./public
COPY next.config.mjs ./

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build the app
RUN npm run build

# Start the application in production mode
CMD ["npm", "start"]

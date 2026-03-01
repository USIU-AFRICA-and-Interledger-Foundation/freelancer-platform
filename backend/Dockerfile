FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY src ./src

# Expose backend port
EXPOSE 3001

# Start development server
CMD ["npm", "run", "dev"]

FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY . .

# uploads dir needs to exist even if empty (local file storage fallback)
RUN mkdir -p uploads data

EXPOSE 4000
CMD ["node", "server.js"]

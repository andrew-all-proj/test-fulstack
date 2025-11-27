FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/

RUN npm install
RUN npm install --prefix client

COPY . .

RUN npm run build:server
RUN npm run build --prefix client

FROM node:20-alpine AS app

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3009

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

COPY package*.json ./

RUN npm install --omit=dev

EXPOSE 3009

CMD ["node", "dist/server/index.js"]


FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/src ./src

ARG GIT_SHA=local
ENV GIT_SHA=${GIT_SHA}
ENV PORT=3000

EXPOSE 3000

CMD ["node", "src/server.js"]

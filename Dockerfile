FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --production=false

COPY . .


FROM node:18-alpine as runtime

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 4000

CMD [ "node", "src/index.js" ]

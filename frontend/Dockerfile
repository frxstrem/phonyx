FROM node:14 AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build


FROM nginx:1.19

COPY --from=builder /app/build /usr/share/nginx/html

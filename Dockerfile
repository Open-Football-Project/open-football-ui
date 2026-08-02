ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package*.json ./

ARG API_HOST=https://footballproject.org
ARG USE_API_MOCK=0
ARG IP_CHECK_HOST=https://api.country.is
ARG GA_MEASUREMENT_ID=G-M3D3ZCREZJ
ARG SHOW_BANNERS=false
ARG BTC_ADDRESS=

RUN npm ci

COPY . .
RUN rm -f .env


ENV VITE_API_HOST=$API_HOST
ENV VITE_USE_API_MOCK=$USE_API_MOCK
ENV VITE_IP_CHECK_HOST=$IP_CHECK_HOST
ENV VITE_GA_MEASUREMENT_ID=$GA_MEASUREMENT_ID
ENV VITE_SHOW_BANNERS=$SHOW_BANNERS
ENV VITE_BTC_ADDRESS=$BTC_ADDRESS

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 1111
CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine AS base
RUN yarn install

FROM base AS development
ARG APP
ENV NODE_ENV=development
WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build ${APP}

FROM base AS production
ARG APP
ENV NODE_ENV=production
WORKDIR /usr/src/app/
COPY package*.json ./
RUN yarn install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["yarn", "run", "start:$APP"]
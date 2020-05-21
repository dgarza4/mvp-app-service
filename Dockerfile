# BUILD STAGE

FROM node:12-alpine as builder
RUN apk add --no-cache git

WORKDIR /app/

COPY package.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY ./src ./src
COPY ./config ./config
RUN yarn && yarn build

# PRODUCTION STAGE

FROM node:12-alpine

RUN apk add --no-cache git

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY yarn.lock ./
RUN yarn --production=true

## We just need the build to execute the command
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config/production.json ./config/

ENTRYPOINT ["node", "dist/index.js"]

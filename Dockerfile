# BUILD STAGE

FROM node:12-alpine as builder

WORKDIR /app/

COPY package.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY .npmrc ./
COPY ./src ./src
COPY ./config ./config
RUN yarn && yarn build

# PRODUCTION STAGE

FROM node:12-alpine

LABEL org.opencontainers.image.url="https://dev.azure.com/endeavor-digital/Technology%20Infrastructure/_git/mvp-app-service?path=%2FREADME.md"
LABEL org.opencontainers.image.source="https://dev.azure.com/endeavor-digital/Technology%20Infrastructure/_git/mvp-app-service"
LABEL org.opencontainers.image.vendor="Endeavor"
LABEL org.opencontainers.image.title="Endeavor Experiences MVP app service"

RUN mkdir /app
RUN addgroup -S myapp && adduser -D -s /bin/false -S scooby -G myapp
RUN chown -R scooby:myapp /app

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY yarn.lock ./
COPY .npmrc ./
RUN yarn --production=true

## We just need the build to execute the command
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config/

USER scooby

#-------------------------------------------------------
# ADD WHATEVER ENVIRONMENT VARIABLE THE SERVICE NEEDS
#-------------------------------------------------------

# backend auth server url
ENV KEYCLOAK_BACKEND_AUTH_SERVER_URL='https://keycloak.cluster1.endvr-digital-dev.com/auth/'
ENV KEYCLOAK_BACKEND_CLIENT='mvp-app-backend'
ENV KEYCLOAK_BACKEND_CREDENTIALS_SECRET='secret'

# frontend auth server url
ENV KEYCLOAK_FRONTEND_AUTH_SERVER_URL='https://keycloak.cluster1.endvr-digital-dev.com/auth/'
ENV KEYCLOAK_FRONTEND_CLIENT='mvp-app-frontend'

ENV KEYCLOAK_REALM='mvpapp'

ENV SDK_AUTH_URL='http://localhost:3080/api/auth/v1/auth/'
ENV SDK_NOTIFICATIONS_URL='http://localhost:3080/api/notifications/v1/notifications/'

EXPOSE 3080/tcp

ENTRYPOINT ["node", "dist/index.js"]

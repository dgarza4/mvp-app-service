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

LABEL org.opencontainers.image.url="https://dev.azure.com/endvr-d-cdp/Endeavor%20Experiences/_git/platform-api-standalone-service-example?path=%2FREADME.md"
LABEL org.opencontainers.image.source="https://dev.azure.com/endvr-d-cdp/Endeavor%20Experiences/_git/platform-api-standalone-service-example"
LABEL org.opencontainers.image.vendor="Endeavor"
LABEL org.opencontainers.image.title="Endeavor Experiences Platform API Standalone Example"

RUN mkdir /app
RUN addgroup -S myapp && adduser -D -s /bin/false -S scooby -G myapp
RUN chown -R scooby:myapp /app

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY yarn.lock ./
RUN yarn --production=true

## We just need the build to execute the command
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config/

USER scooby

#-------------------------------------------------------
# ADD WHATEVER ENVIRONMENT VARIABLE THE SERVICE NEEDS
#-------------------------------------------------------

# backend auth server url
ENV KEYCLOAK_BACKEND_AUTH_SERVER_URL='http://keycloak-service:8080/auth/'
ENV KEYCLOAK_BACKEND_CLIENT='endeavor-speakers-backend'
ENV KEYCLOAK_BACKEND_CREDENTIALS_SECRET='secret'

# frontend auth server url
ENV KEYCLOAK_FRONTEND_AUTH_SERVER_URL='http://keycloak-service:8080/auth/'
ENV KEYCLOAK_FRONTEND_CLIENT='endeavor-speakers-frontend'

ENV KEYCLOAK_REALM='endeavor-speakers'


EXPOSE 3080/tcp

ENTRYPOINT ["node", "dist/index.js"]

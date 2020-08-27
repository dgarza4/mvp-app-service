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

# If aws-cognito, it is the id of an application created in the user pool.
# IMPORTANT: the application must be created with `Generate client secret` NOT SET
ENV AUTH_PROVIDER_CLIENT_ID=""
# if aws-cognito, the User Pool's region
ENV AUTH_PROVIDER_REGION=""
# This is the user designed to be represent the service
ENV AUTH_PROVIDER_SERVICE_USERNAME=""
ENV AUTH_PROVIDER_SERVICE_PASSWORD=""

# Accounts service URL
ENV SDK_ACCOUNTS_URL="http://accounts-service/api/accounts/v1/"
# Notifications service URL
ENV SDK_NOTIFICATIONS_URL="http://notifications-service/api/notifications/v1/notifications/"

EXPOSE 3080/tcp

ENTRYPOINT ["node", "dist/index.js"]

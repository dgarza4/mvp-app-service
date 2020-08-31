# MVP App service

## Introduction

The mvp-app-service service is a [Platform API Standalone Service](https://dev.azure.com/endeavor-digital/Technology%20Infrastructure/_git/platform-api?path=%2Fdocs%2Fnotifications-manager.md&_a=preview).

It has a single CRUD-like controller for todos (it extends the ControllerCRUD class).

## Getting Started

### Installation process

```sh
# to use the correct Node version, use nvm (https://github.com/nvm-sh/nvm)
nvm use
# try to use yarn
yarn
# or
# npm install
```

### Kubernetes

#### Setup

You need to have `kubectl` access to the Kubernetes `cluster1.endvr-digital-dev.com` dev cluster and [Telepresence](https://www.telepresence.io/reference/install) installed.

To avoid SSH connection timeouts, add to your `~/.ssh/config` the following:

```txt
Host *
 ServerAliveInterval 30
```

#### Build

First you will need to build the `Dockerfile.dev` local image:

```sh
yarn run docker:build-dev
```

or, manually:

```sh
docker build -t mvp-app-service -f Dockerfile.dev .
```

#### Pre Deployment

You will also need to scale the deployed service to `1` before starting it locally, or you will not receive all requests.

You can:

```sh
yarn start k8s:scale-down
```

Which is equivalent to:

```sh
kubectl -n mvp-app-develop scale --replicas=1 deployment mvp-app-service
```

But keep in mind that if replicas are managed under Gitops, they will be reset by Flux. You might need to edit the configuration file in the git repo.

If the service is deployed using Flux, we need also to stop Flux trying to restart it:

```sh
yarn run k8s:flux-disable
```

which is the equivalent of:

```sh
kubectl -n mvp-app-develop annotate deployment mvp-app-service 'fluxcd.io/ignore=true'
```

**REMEMBER** to remove the annotation when done!

```sh
yarn run k8s:flux-enable
```

which is the equivalent of:

```sh
kubectl -n mvp-app-develop annotate deployment mvp-app-service 'fluxcd.io/ignore-'
```

#### Deployment

The following will start the local container exposing it inside the Kubernetes cluster (swapping the current running one) and locally at port `${TP_PORT:-3080}`:

```sh
yarn tp:start-dev
```

Now you can edit the code inside the `./src/` folder and have the server automatically restarted on change. Also the local `./config` folder is made accessible from inside the container.

### Start

First we need to provide some configuration to be able to generate JWT tokens for inter-service communication:

```sh
# If aws-cognito, it is the id of an application created in the user pool.
# IMPORTANT: the application must be created with `Generate client secret` NOT SET
export AUTH_PROVIDER_CLIENT_ID="<CLIENT_ID"
# if aws-cognito, the User Pool's region
export AUTH_PROVIDER_REGION="us-east-1"
# This is the user designed to be represent the service
export AUTH_PROVIDER_SERVICE_USERNAME="alessandro.iob@gmail.com"
export AUTH_PROVIDER_SERVICE_PASSWORD="password"
```

If `AUTH_PROVIDER_SERVICE_USERNAME` or `AUTH_PROVIDER_SERVICE_PASSWORD` ar not set, the feature is disabled and all inter-service calls will happen without Bearer token.

Some more configurations to access the needed services:

```sh
# Accounts is used to retrieve user information: this one is special, note it needs the URL up to and including the API version
export SDK_ACCOUNTS_URL="http://localhost:3081/api/accounts/v1/"
# Notification is used to send emails/slack messages/etc.
export SDK_NOTIFICATIONS_URL="http://localhost:3082/api/notifications/v1/notifications/"
```

Than just:

```sh
npx ts-node src/index.ts
```

With the default configurations, a server will be started at http://localhost:3080

All configurations can be found in the `./config/` folder. The `default.json` is loaded first, than the one matching the `NODE_ENV` (default is `dev.json`) and than the command line and environment variables. For a list of all available command line options and environment variables:

```sh
npx ts-node src/index.ts --help
```

## Migrations

To use database entities defined in the service's `entities` folder you must first generate migration. For the first one just:

```sh
npx ts-node src/index.ts --generate-migration setup
```

For the others, change the migration name.

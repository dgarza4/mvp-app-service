# MVP app service

The MVP app service is a Platform API Standalone Service. It has a single CRUD-like controller for quotes (it extends the ControllerCRUD class).

## Notes:

The only major things required to get this going was:
- rename the original service and controllers (from talent to quote)
- clean up the controller to make it a basic CRUD controller
- update the config/default.json file to disable some base services
- update the config/dev.json file to update the DB config values
- used a local docker container running mysql:8 with the config values from the config/dev.json file
- `yarn start-dev` to start the app


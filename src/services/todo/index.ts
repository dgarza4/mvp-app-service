import _ from "lodash";
import { Service } from "platform-api";

export = class TodoService extends Service {
  static configurationSchema(serviceName: string): any {
    const serviceNameLower = _.kebabCase(serviceName).toLowerCase();
    const serviceNameUpper = _.snakeCase(serviceName).toUpperCase();

    return _.merge(Service.configurationSchema(serviceName), {
      services: {
        [serviceName]: {
          search: {
            enabled: {
              doc: `The ${serviceName} service  starts only if enabled`,
              format: Boolean,
              default: false,
              env: `SERVICE_${serviceNameUpper}_SEARCH_ENABLED`,
              arg: `service-${serviceNameLower}-search-enabled`,
            },
          },
        },
      },
    });
  }

  public init(): void {
    this.logger.info(`server.service.${this.name}.init: starting...`);

    // used by auto-loaders
    this.folder = __dirname;

    super.init();

    this.logger.info(`server.service.${this.name}.init: finished`);
  }

  public async setup(): Promise<void> {
    this.logger.info(`server.service.${this.name}.setup: starting...`);

    this.logger.debug(
      ">>> AUTH MANAGER CONFIG: ${JSON.stringify(config, null, 2)}'",
      { config: this.config.get("core.auth-manager") }
    );

    await super.setup();

    this.logger.info(`server.service.${this.name}.setup: finished`);
  }

  public async start(): Promise<any> {
    this.logger.info(`server.service.${this.name}.start: starting...`);

    await super.start();

    this.logger.info(`server.service.${this.name}.start: finished`);
  }

  public async stop(): Promise<any> {
    this.logger.info(`server.service.${this.name}.stop: starting...`);

    await super.stop();

    this.logger.info(`server.service.${this.name}.stop: finished`);
  }
};

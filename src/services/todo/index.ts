import { Service } from "platform-api";

export = class TodoService extends Service {
  public init(): void {
    this.logger.info(`server.service.${this.name}.init: starting...`);

    // used by auto-loaders
    this.folder = __dirname;

    super.init();

    this.logger.info(`server.service.${this.name}.init: finished`);
  }

  public async setup(): Promise<void> {
    this.logger.info(`server.service.${this.name}.setup: starting...`);

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

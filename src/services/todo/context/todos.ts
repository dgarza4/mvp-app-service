import _ from "lodash";
import { ContextCRUD } from "platform-api";
import { NOTIFICATION_TARGET_TYPE } from "platform-api";
import { requestUserId } from "platform-api";

// Place all your business logic inside contexts
export class TodosContext extends ContextCRUD {
  public async setup(): Promise<void> {
    await super.setup();
  }

  // Example custom entity update method that sends a notification
  public async updateEntity(
    entityId: string,
    payload: any,
    authOptions: any = {},
    relations: string[] = []
  ): Promise<any> {
    const entity = await super.updateEntity(
      entityId,
      payload,
      authOptions,
      relations
    );

    if (payload.done) {
      await this.notifyUser(authOptions.account, entity);
    }

    return entity;
  }

  // Example method used to send a notification to the test service user ont task completion
  protected async notifyUser(account: any, todo: any) {
    const options: any = {
      fromAddress: this.config.getSafe(
        "services.todo.notifications.fromAddress",
        "do.not.reply@endeavor.test"
      ),
    };
    const messageType = this.config.getSafe(
      "services.todo.notifications.messageType",
      "mvp-app-task-completed"
    );
    const targetMessages = [
      {
        targetType: NOTIFICATION_TARGET_TYPE.ACCOUNT,
        target: account,
        messageType: messageType,
        options,
      },
      {
        targetType: NOTIFICATION_TARGET_TYPE.SLACK_CHANNEL,
        target: "#",
        messageType: messageType,
        options,
      },
    ];

    const payload = {
      user: account,
      todo,
    };

    await this.notifyTargets(targetMessages, payload, {
      success:
        "server.service.todo.context.notifyUser: successfully sent todo notification to '${JSON.stringify(target)}'",
      error:
        "server.service.todo.context.notifyUser: error sending todo notification to '${JSON.stringify(target)}' as ${error}\n${error.stack}",
    });
  }
}

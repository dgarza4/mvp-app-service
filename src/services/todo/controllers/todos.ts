import _ from "lodash";
import express from "express";
import { Todo } from "../entities/todo";
import { ControllerCRUD, Auth } from "platform-api";
import { Controller, Get, Post, Put, Delete } from "platform-api";
import { NOTIFICATION_TARGET_TYPE } from "platform-api";
import { requestUserToUserInfo } from "platform-api";

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     TodoNew:
 *       type: object
 *       required:
 *         - title
 *         - done
 *       properties:
 *         title:
 *           type: string
 *         done:
 *           type: boolean
 *
 *     Todo:
 *       allOf:
 *         - $ref: '#/components/schemas/TodoNew'
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
 *               readOnly: true
 *
 */

@Controller("/v1/todos")
class TodosController extends ControllerCRUD {
  public entityName = "todo";
  public entityClass = Todo;

  public async start(): Promise<void> {
    super.start();
  }

  /**
   * @swagger
   *
   * /v1/todos/:
   *   get:
   *     summary: Get a list of todos
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Todo
   *     parameters:
   *       - $ref: '#/components/parameters/offsetParam'
   *       - $ref: '#/components/parameters/pageParam'
   *       - $ref: '#/components/parameters/limitParam'
   *       - $ref: '#/components/parameters/orderParam'
   *       - $ref: '#/components/parameters/fieldsParam'
   *       - $ref: '#/components/parameters/whereParam'
   *       - $ref: '#/components/parameters/whereSomeParam'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Todo'
   */
  @Get("/")
  @Auth()
  protected async find(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.find(req, res);
  }

  protected async preProcessSearchOptions(
    req: any,
    searchOptions: any
  ): Promise<any> {
    const userId = req.user.email;
    const whereOptions = [];

    whereOptions.push([`${this.entityName}.user_id = :userId`, { userId }]);

    if (_.isEmpty(searchOptions.andWhere)) {
      searchOptions.andWhere = whereOptions;
    } else {
      searchOptions.andWhere = _.concat(whereOptions, searchOptions.andWhere);
    }

    return searchOptions;
  }

  /**
   * @swagger
   *
   * /v1/todos/{id}:
   *   get:
   *     summary: Get a todo entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Todo
   *     parameters:
   *       - $ref: '#/components/parameters/idParam'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Todo'
   */
  @Get("/:id")
  @Auth()
  protected async get(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.get(req, res);
  }

  /**
   * @swagger
   *
   * /v1/todos/:
   *   post:
   *     summary: Create a new todo entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Todo
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TodoNew'
   *           example:
   *             title: Do something!
   *             done: false
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Todo'
   */
  @Post("/")
  @Auth()
  protected async post(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.post(req, res);
  }

  protected async preProcessPostPayload(req: any, payload: any): Promise<any> {
    const userId = req.user.email;

    // eslint-disable-next-line @typescript-eslint/camelcase
    payload.user_id = userId;

    return payload;
  }

  /**
   * @swagger
   *
   * /v1/todos/{id}:
   *   put:
   *     summary: Update a todo entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Todo
   *     parameters:
   *       - $ref: '#/components/parameters/idParam'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TodoNew'
   *           example:
   *             title: Do something!
   *             done: false
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Todo'
   */
  @Put("/:id")
  @Auth()
  protected async put(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    const todo = await super.put(req, res);

    await this.notifyUser(requestUserToUserInfo(req), todo);

    return todo;
  }

  protected async notifyUser(user: any, todo: any) {
    const options: any = {
      fromAddress: "mvp-app-bot@mvp-app.cluster1.endvr-digital-dev.com",
    };

    const targetMessages = [
      {
        targetType: NOTIFICATION_TARGET_TYPE.USER,
        target: user,
        messageType: "mvp-app-task-completed",
        options,
      },
      {
        targetType: NOTIFICATION_TARGET_TYPE.SLACK_CHANNEL,
        target: "#",
        messageType: "mvp-app-task-completed",
        options,
      },
    ];

    const payload = {
      user,
      todo,
    };

    await this.notifyTargets(targetMessages, payload, {
      success:
        "server.service.todo.notifyUser: successfully sent todo notification to '${JSON.stringify(target)}'",
      error:
        "server.service.todo.notifyUser: error sending todo notification to '${JSON.stringify(target)}' as ${error}\n${error.stack}",
    });
  }

  protected notifyTargets = async (
    targetMessages: any[],
    payload: any,
    logMessages: any = {},
    _useSDK = false
  ) => {
    const ps: any = [];

    _.forEach(targetMessages, (targetMessage) => {
      ps.push(
        this.registry.api.notifications.notifyTargetType(
          targetMessage.targetType,
          targetMessage.target,
          targetMessage.messageType,
          payload,
          targetMessage.options,
          logMessages
        )
      );
    });

    await Promise.all(ps);
  };

  /**
   * @swagger
   *
   * /v1/todos/{id}:
   *   delete:
   *     summary: Delete a todo entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Todo
   *     parameters:
   *       - $ref: '#/components/parameters/idParam'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Todo'
   */
  @Delete("/:id")
  @Auth()
  protected async delete(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.delete(req, res);
  }
}

export = TodosController;

import _ from "lodash";
import express from "express";
import { Todo } from "../entities/todo";
import { ControllerCRUD, Auth } from "platform-api";
import { Controller, Get, Post, Put, Delete } from "platform-api";
import { TodosContext } from "../context/todos";

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

  // All business logic happens in the context
  protected contextClass: any = TodosContext;

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
  @Auth({ includeAccount: true, verifyEntityAccount: true })
  protected async find(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.find(req, res);
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
  @Auth({ includeAccount: true, verifyEntityAccount: true })
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
  @Auth({ includeAccount: true, verifyEntityAccount: true })
  protected async post(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.post(req, res);
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
  @Auth({ includeAccount: true, verifyEntityAccount: true })
  protected async put(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.put(req, res);
  }

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
  @Auth({ includeAccount: true, verifyEntityAccount: true })
  protected async delete(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.delete(req, res);
  }
}

export = TodosController;

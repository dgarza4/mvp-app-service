import _ from "lodash";
import express from "express";
import { Quote } from "../entities/quote";
import { ControllerCRUD, Auth } from "platform-api";
import { Controller, Get, Post, Put, Delete } from "platform-api";

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     QuoteNew:
 *       type: object
 *       required:
 *         - value
 *       properties:
 *         value:
 *           type: string
 *
 *     Quote:
 *       allOf:
 *         - $ref: '#/components/schemas/QuoteNew'
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
 *               readOnly: true
 *
 */

@Controller("/v1/quotes")
class QuotesController extends ControllerCRUD {
  public entityName = "quote";
  public entityClass = Quote;
  public entityScopes = { view: [], write: [] };
  public hasEntityAuthResource = true;

  public async start(): Promise<void> {
    super.start();
  }

  /**
   * @swagger
   *
   * /v1/quotes/:
   *   get:
   *     summary: Get a list of quotes
   *     tags:
   *       - Quote
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
   *                 $ref: '#/components/schemas/Quote'
   */
  @Get("/")
  @Auth({ permissions: ["quote:${id}?view"] })
  protected async find(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.find(req, res);
  }

  /**
   * @swagger
   *
   * /v1/quotes/{id}:
   *   get:
   *     summary: Get a quote entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Quote
   *     parameters:
   *       - $ref: '#/components/parameters/idParam'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Quote'
   */
  @Get("/:id")
  @Auth({ permissions: ["quote:${id}?view"] })
  protected async get(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.get(req, res);
  }

  /**
   * @swagger
   *
   * /v1/quotes/:
   *   post:
   *     summary: Create a new quote entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Quote
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/QuoteNew'
   *           example:
   *             value: The pizza delivery boy tips Chuck Norris.
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Quote'
   */
  @Post("/")
  @Auth({ permissions: ["quote:${id}?write"] })
  protected async post(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.post(req, res);
  }

  /**
   * @swagger
   *
   * /v1/quotes/{id}:
   *   put:
   *     summary: Update a quote entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Quote
   *     parameters:
   *       - $ref: '#/components/parameters/idParam'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/QuoteNew'
   *           example:
   *             value: The pizza delivery boy tips Chuck Norris.
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Quote'
   */
  @Put("/:id")
  @Auth({ permissions: ["quote:${id}?write"] })
  protected async put(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.put(req, res);
  }

  /**
   * @swagger
   *
   * /v1/quotes/{id}:
   *   delete:
   *     summary: Delete a quote entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Quote
   *     parameters:
   *       - $ref: '#/components/parameters/idParam'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Quote'
   */
  @Delete("/:id")
  @Auth({ permissions: ["quote:${id}?write"] })
  protected async delete(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.delete(req, res);
  }
}

export = QuotesController;

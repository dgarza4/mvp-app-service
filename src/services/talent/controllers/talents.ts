import _ from "lodash";
import express from "express";
import { Talent } from "../entities/talent";
import { ControllerCRUD } from "platform-api";
import { Controller, Get, Post, Put, Delete, Auth } from "platform-api";
import { applyOnFields } from "platform-api";

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     TalentNew:
 *       type: object
 *       required:
 *         - name
 *         - headline
 *         - bio_highlights
 *         - bio_details
 *       properties:
 *         enabled:
 *           type: boolean
 *         name:
 *           type: string
 *         headline:
 *           type: string
 *         bio_highlights:
 *           type: string
 *         bio_details:
 *           type: string
 *         social_accounts:
 *           type: object
 *           additionalProperties:
 *             type: string
 *         metadata:
 *           type: object
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *         topics:
 *           type: array
 *           items:
 *             type: string
 *         agents:
 *           type: array
 *           readOnly: true
 *           items:
 *             type: string
 *
 *     Talent:
 *       allOf:
 *         - $ref: '#/components/schemas/TalentNew'
 *         - type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
 *               readOnly: true
 *
 */

@Controller("/v1/talents")
class TalentsController extends ControllerCRUD {
  public entityName = "talent";
  public entityClass = Talent;
  public entityScopes = { view: [], write: [] };
  public hasEntityAuthResource = true;

  public async start(): Promise<void> {
    super.start();
  }

  /**
   * @swagger
   *
   * /v1/talents/:
   *   get:
   *     summary: Get a list of talents
   *     tags:
   *       - Talent
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
   *                 $ref: '#/components/schemas/Talent'
   */
  @Get("/")
  // @Auth({ roles: ["realm:admin"] })
  protected async find(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    const whereValues: any = {};
    const userId = this.registry.api.auth.keycloak.getUserIdFromReq(req);

    if (userId) {
      whereValues["ME"] = userId;
    }

    return super.find(req, res, whereValues);
  }

  /**
   * @swagger
   *
   * /v1/talents/{id}:
   *   get:
   *     summary: Get a talent entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Talent
   *     parameters:
   *       - $ref: '#/components/parameters/idParam'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Talent'
   */
  @Get("/:id")
  @Auth({ permissions: ["talent:${id}?view"] })
  protected async get(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.get(req, res);
  }

  /**
   * @swagger
   *
   * /v1/talents/:
   *   post:
   *     summary: Create a new talent entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Talent
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TalentNew'
   *           example:
   *             name: Alessandro Iob
   *             headline: "He is somebody from Italy"
   *             bio_highlights: "Wrote some software"
   *             bio_details: "Sometimes that software worked!"
   *             social_accounts:
   *               github: "https://github.com/alexiob"
   *             metadata: {}
   *             reviews: []
   *             notes: "Can he really write software?"
   *             categories:
   *               - software
   *               - strange
   *             topics:
   *               - random
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Talent'
   */
  @Post("/")
  @Auth({ roles: ["realm:talent_manager"] })
  protected async post(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.post(req, res);
  }

  protected async preProcessPostPayload(
    req: express.Request,
    payload: any
  ): Promise<any> {
    const userId = this.registry.api.auth.keycloak.getUserIdFromReq(req);
    const userRoles = this.registry.api.auth.keycloak.getUserRolesFromReq(req);
    const agents: string[] = [];

    if (_.includes(userRoles, "talent_manager")) {
      agents.push(userId);
    }

    payload.agents = agents;

    return this.normalizePayload(payload);
  }

  /**
   * @swagger
   *
   * /v1/talents/{id}:
   *   put:
   *     summary: Update a talent entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Talent
   *     parameters:
   *       - $ref: '#/components/parameters/idParam'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TalentNew'
   *           example:
   *             name: Alessandro Iob
   *             headline: "He is somebody from Italy"
   *             bio_highlights: "Wrote some software"
   *             bio_details: "Sometimes that software worked!"
   *             social_accounts:
   *               github: "https://github.com/alexiob"
   *             metadata: {}
   *             reviews: []
   *             notes: "Can he really write software?"
   *             categories:
   *               - software
   *               - strange
   *             topics:
   *               - random
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Talent'
   */
  @Put("/:id")
  @Auth({ permissions: ["talent:${id}?write"] })
  protected async put(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.put(req, res);
  }

  protected async preProcessPutPayload(
    req: express.Request,
    payload: any
  ): Promise<any> {
    if (_.has(payload, "agents")) {
      delete payload.agents;
    }

    return this.normalizePayload(payload);
  }

  /**
   * @swagger
   *
   * /v1/talents/{id}:
   *   delete:
   *     summary: Delete a talent entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Talent
   *     parameters:
   *       - $ref: '#/components/parameters/idParam'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Talent'
   */
  @Delete("/:id")
  @Auth({ permissions: ["talent:${id}?write"] })
  protected async delete(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.delete(req, res);
  }

  /**
   * @swagger
   *
   * /v1/talents/{id}/agent:
   *   put:
   *     summary: Add an agent user to a talent entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Talent
   *     parameters:
   *       - $ref: '#/components/parameters/idParam'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               agent_id:
   *                 type: string
   *                 required: true
   *           example:
   *             agent_id: "alessandro_iob"
   *     responses:
   *       '200':
   *         description: OK
   */
  @Put("/:id/agent")
  @Auth({ permissions: ["talent:${id}?write"] })
  protected async addAgent(
    req: express.Request,
    _res: express.Response
  ): Promise<any> {
    const entityId = req.params.id;
    const agentUserId = req.body.agent_id;
    const entity = await this.getEntity(entityId);

    if (!_.includes(entity.agents, agentUserId)) {
      for (const scope of _.keys(this.entityScopes)) {
        await this.registry.api.auth.keycloak.updateUserInResourceScope(
          this.entityName,
          entityId,
          agentUserId,
          scope
        );
      }

      entity.agents = _.concat(entity.agents, [agentUserId]);

      return this.saveEntity(entity);
    }
  }

  /**
   * @swagger
   *
   * /v1/talents/{id}/agent:
   *   delete:
   *     summary: Remove an agent user to a talent entry
   *     security:
   *       - BearerAuth: []
   *     tags:
   *       - Talent
   *     parameters:
   *       - $ref: '#/components/parameters/idParam'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               agent_id:
   *                 type: string
   *           example:
   *             agent_id: "alessandro_iob"
   *     responses:
   *       '200':
   *         description: OK
   */
  @Delete("/:id/agent")
  @Auth({ permissions: ["talent:${id}?write"] })
  protected async removeAgent(
    req: express.Request,
    _res: express.Response
  ): Promise<any> {
    const entityId = req.params.id;
    const agentUserId = req.body.agent_id;
    const entity = await this.getEntity(entityId);

    if (_.includes(entity.agents, agentUserId)) {
      for (const scope of _.keys(this.entityScopes)) {
        await this.registry.api.auth.keycloak.updateUserInResourceScope(
          this.entityName,
          entityId,
          agentUserId,
          scope,
          false
        );
      }

      entity.agents = _.without(entity.agents, agentUserId);

      return this.saveEntity(entity);
    }
  }

  // UTILITIES

  private normalizePayload(payload: any) {
    return applyOnFields(payload, ["categories", "topics"], _.lowerCase);
  }
}

export = TalentsController;

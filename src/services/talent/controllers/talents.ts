import _ from "lodash";
import express from "express";
import { Talent } from "../entities/talent";
import { ControllerCRUD } from "platform-api";
import { Controller, Get, Post, Put, Delete, Auth } from "platform-api";
import { applyOnFields } from "platform-api";

@Controller("/v1/talents")
class TalentsController extends ControllerCRUD {
  public entityName = "talent";
  public entityClass = Talent;
  public entityScopes = { view: [], write: [] };
  public hasEntityAuthResource = true;

  public async start(): Promise<void> {
    super.start();
  }

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

  @Get("/:id")
  @Auth({ permissions: ["talent:${id}?view"] })
  protected async get(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.get(req, res);
  }

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

  @Delete("/:id")
  @Auth({ permissions: ["talent:${id}?write"] })
  protected async delete(
    req: express.Request,
    res: express.Response
  ): Promise<any> {
    return super.delete(req, res);
  }

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

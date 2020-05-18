import _ from "lodash";

import { ContextCRUD } from "platform-api";

export class TalentContext extends ContextCRUD {
  public async addAgent(
    entityId: string,
    agentUserId: string,
    authOptions: any = {}
  ): Promise<any> {
    const entity = await this.getEntity(entityId);

    if (!_.includes(entity.agents, agentUserId)) {
      if (_.isObject(authOptions.entityScopes)) {
        for (const scope of _.keys(authOptions.entityScopes)) {
          await this.registry.api.auth.keycloak.updateUserInResourceScope(
            this.entityName(entity, authOptions),
            entityId,
            agentUserId,
            scope
          );
        }
      }

      entity.agents = _.concat(entity.agents, [agentUserId]);

      return this.saveEntity(entity);
    } else {
      return entity;
    }
  }

  public async removeAgent(
    entityId: string,
    agentUserId: string,
    authOptions: any = {}
  ): Promise<any> {
    const entity = await this.getEntity(entityId);

    if (_.includes(entity.agents, agentUserId)) {
      if (_.isObject(authOptions.entityScopes)) {
        for (const scope of _.keys(authOptions.entityScopes)) {
          await this.registry.api.auth.keycloak.updateUserInResourceScope(
            this.entityName(entity, authOptions),
            entityId,
            agentUserId,
            scope,
            false
          );
        }
      }

      entity.agents = _.without(entity.agents, agentUserId);

      return this.saveEntity(entity);
    } else {
      return entity;
    }
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";
export class TalentTalentAgents1589455202950 implements MigrationInterface {
  name = "TalentTalentAgents1589455202950";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `talent` ADD `agents` json NOT NULL",
      undefined
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `talent` DROP COLUMN `agents`",
      undefined
    );
  }
}

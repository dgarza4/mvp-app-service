import { MigrationInterface, QueryRunner } from "typeorm";
export class TalentTalentLabels1589451531687 implements MigrationInterface {
  name = "TalentTalentLabels1589451531687";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `talent` ADD `categories` json NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `talent` ADD `topics` json NOT NULL",
      undefined
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `talent` DROP COLUMN `topics`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `talent` DROP COLUMN `categories`",
      undefined
    );
  }
}

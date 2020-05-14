import { MigrationInterface, QueryRunner } from "typeorm";
export class TalentSetup1589367209836 implements MigrationInterface {
  name = "TalentSetup1589367209836";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `talent` (`created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `version` int NOT NULL, `deleted` tinyint NOT NULL, `id` varchar(36) NOT NULL, `enabled` tinyint NOT NULL DEFAULT 1, `name` varchar(255) NOT NULL, `headline` varchar(255) NULL, `bio_highlights` varchar(255) NOT NULL, `bio_details` varchar(255) NOT NULL, `social_accounts` json NOT NULL, `metadata` json NOT NULL, `reviews` json NOT NULL, `notes` varchar(255) NULL, INDEX `IDX_4d5297789524378c5a947c476f` (`created_at`), INDEX `IDX_e4ff4829fb8c89600886ce5a52` (`deleted`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DROP INDEX `IDX_e4ff4829fb8c89600886ce5a52` ON `talent`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_4d5297789524378c5a947c476f` ON `talent`",
      undefined
    );
    await queryRunner.query("DROP TABLE `talent`", undefined);
  }
}

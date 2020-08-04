import { MigrationInterface, QueryRunner } from "typeorm";
export class TodoSetup1596558134764 implements MigrationInterface {
  name = "TodoSetup1596558134764";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `todo` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `version` int NOT NULL, `deleted` tinyint NOT NULL, `user_id` varchar(255) NOT NULL, `title` text NOT NULL, `done` tinyint NOT NULL DEFAULT 0, INDEX `IDX_a14f2d86f3e3d533d55d61b6cf` (`created_at`), INDEX `IDX_ee76d6e26c17748b8f618d1088` (`deleted`), INDEX `IDX_9cb7989853c4cb7fe427db4b26` (`user_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DROP INDEX `IDX_9cb7989853c4cb7fe427db4b26` ON `todo`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_ee76d6e26c17748b8f618d1088` ON `todo`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_a14f2d86f3e3d533d55d61b6cf` ON `todo`",
      undefined
    );
    await queryRunner.query("DROP TABLE `todo`", undefined);
  }
}

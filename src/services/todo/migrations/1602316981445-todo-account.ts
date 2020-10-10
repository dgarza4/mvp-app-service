import { MigrationInterface, QueryRunner } from "typeorm";
export class TodoAccount1602316981445 implements MigrationInterface {
  name = "TodoAccount1602316981445";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DROP INDEX `IDX_9cb7989853c4cb7fe427db4b26` ON `todo`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `todo` CHANGE `user_id` `account_id` varchar(255) NOT NULL",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_417bcf3baaef311f1e17304067` ON `todo` (`account_id`)",
      undefined
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DROP INDEX `IDX_417bcf3baaef311f1e17304067` ON `todo`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `todo` CHANGE `account_id` `user_id` varchar(255) NOT NULL",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_9cb7989853c4cb7fe427db4b26` ON `todo` (`user_id`)",
      undefined
    );
  }
}

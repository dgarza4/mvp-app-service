import { MigrationInterface, QueryRunner } from "typeorm";
export class QuoteQuotes1596202942852 implements MigrationInterface {
  name = "QuoteQuotes1596202942852";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `quote` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `version` int NOT NULL, `deleted` tinyint NOT NULL, `value` varchar(255) NOT NULL, INDEX `IDX_5002dca9bc8cf20d8ca9111ed1` (`created_at`), INDEX `IDX_803a3ad7b88256f2ae9bc51cbf` (`deleted`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DROP INDEX `IDX_803a3ad7b88256f2ae9bc51cbf` ON `quote`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_5002dca9bc8cf20d8ca9111ed1` ON `quote`",
      undefined
    );
    await queryRunner.query("DROP TABLE `quote`", undefined);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class createAt1658139205763 implements MigrationInterface {
  name = "createAt1658139205763";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "access_code" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "reservation" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "unit" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "lock" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "access_token" ALTER COLUMN "created_at" SET DEFAULT now()`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "access_token" ALTER COLUMN "created_at" DROP DEFAULT`
    );
    await queryRunner.query(`ALTER TABLE "lock" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "reservation" DROP COLUMN "created_at"`
    );
    await queryRunner.query(
      `ALTER TABLE "access_code" DROP COLUMN "created_at"`
    );
  }
}
